import pool from "../config/dbConfig.js";
import { isUUID } from "../utils/validate.js";
import Preference from "./Preference.js";
import Section from "./Section.js";
import Tag from "./Tag.js";
import Task from "./Task.js";
import Workspace from "./Workspace.js";

class User {
  constructor(
    username,
    firstName,
    lastName,
    email,
    password_hash,
    phone_number = undefined
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone_number = phone_number;
    this.password_hash = password_hash;
  }

  async save() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertUserProfile =
        "INSERT INTO user_profile (username, creation_date, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id";
      const { rows } = await client.query(insertUserProfile, [
        this.username,
        new Date().toISOString(),
        this.firstName,
        this.lastName,
      ]);
      const userId = rows[0].id;

      const insertUserSecurity =
        "INSERT INTO user_security (id, password_hash) VALUES ($1, $2)";
      await client.query(insertUserSecurity, [userId, this.password_hash]);

      if (this.phone_number) {
        const query =
          "INSERT INTO user_contact (user_id, email, phone_number) VALUES ($1, $2, $3);";
        await client.query(query, [userId, this.email, this.phone_number]);
      } else {
        const query =
          "INSERT INTO user_contact (user_id, email) VALUES ($1, $2);";
        await client.query(query, [userId, this.email]);
      }
      await client.query("COMMIT");
      return [userId];
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  static async find(criteria, bool = false) {
    const result = await this.findId(
      criteria.username,
      criteria.email,
      criteria.phone_number,
      criteria.id
    );
    if (!result) {
      return undefined;
    }

    let result_clean = [];

    for (const r of result) {
      if (bool) {
        if (r.length === 2) {
          return "username already taken";
        }
        return true;
      } else {
        result_clean.push(r[0]);
      }
    }
    let users = [];

    for (const id of result_clean) {
      const userData = await this.getData("all", id);
      if (!userData) {
        continue;
      }

      const hash_password = await this.getHashPassword(id);
      userData.tags = await Tag.find(id);
      userData.workspaces = await this.findWorkspacesByUserId(id);

      userData.preferences = await this.getPreferences(id);

      userData.tasks = [];
      userData.sections = [];
      await Promise.all(
        userData.workspaces.map(async (workspace) => {
          const tasks = await this.getTasks(workspace.id);
          const sections = await this.getSections(workspace.id);
          userData.tasks.push(...tasks);
          userData.sections.push(...sections);
        })
      );
      users.push(id, userData, hash_password);
    }

    return users;
  }
  static async findId(
    username = undefined,
    email = undefined,
    phone_number = undefined
  ) {
    const searchCriteria = [
      {
        value: email,
        query:
          "SELECT user_profile.id FROM user_profile JOIN user_contact ON user_profile.id = user_contact.user_id WHERE user_contact.email = $1",
      },
      {
        value: username,
        query: "SELECT id FROM user_profile WHERE username = $1  LIMIT 1",
      },
      {
        value: phone_number,
        query:
          "SELECT user_profile.id FROM user_profile JOIN user_contact ON user_profile.id = user_contact.user_id WHERE user_contact.phone_number = $1",
      },
    ];

    let foundIds = [];
    for (let criterion of searchCriteria.filter((c) => c.value !== undefined)) {
      try {
        const { rows } = await pool.query(criterion.query, [criterion.value]);
        rows.forEach((row) => {
          if (!foundIds.includes(row.id)) {
            if (criterion.value === username) {
              foundIds.push([row.id, "username taken"]);
            } else {
              foundIds.push([row.id]);
            }
          }
        });
      } catch (error) {
        throw error;
      }
    }

    if (foundIds.length > 0) {
      return foundIds;
    } else {
      return false;
    }
  }

  static async getData(data, id) {
    const validColumns = {
      all: "user_profile.username, user_profile.first_name, user_profile.last_name, user_contact.email, user_contact.phone_number",
      username: "user_profile.username",
      first_name: "user_profile.first_name",
      last_name: "user_profile.last_name",
      email: "user_contact.email",
      phone_number: "user_contact.phone_number",
    };

    if (!(data in validColumns)) {
      throw new Error("Invalid data request");
    } else if (!isUUID(id)) {
      throw new Error("invalid ID");
    }

    const query = `SELECT ${validColumns[data]} FROM user_profile
                   LEFT JOIN user_contact ON user_profile.id = user_contact.user_id
                   WHERE user_profile.id = $1`;
    const { rows } = await pool.query(query, [id]);

    return rows[0];
  }

  static async getHashPassword(id) {
    if (!isUUID(id)) {
      throw new Error("Invalid id provided.");
    }
    try {
      const result = await pool.query(
        "SELECT password_hash FROM user_security WHERE id = $1",
        [id]
      );
      if (result.length > 1) {
        res.send(401);
      }
      return result.rows[0].password_hash;
    } catch (error) {
      res.send(401);
    }
  }

  static async getSections(id) {
    if (id) {
      try {
        const sections = await Section.find(id);
        return sections;
      } catch (error) {
        throw error;
      }
    }
  }
  static async getTags(id) {
    if (id) {
      try {
        const tags = await Tag.find(id);
        return tags;
      } catch (error) {
        throw error;
      }
    }
  }
  static async getTasks(id) {
    if (id) {
      try {
        const tasks = await Task.find(id);

        return tasks;
      } catch (error) {
        throw error;
      }
    } else {
      console.error("no id");
    }
  }

  static async getPreferences(id) {
    if (id) {
      try {
        const preferences = await Preference.getUserPreferences(id, "*");
        return preferences;
      } catch (error) {
        throw error;
      }
    }
  }

  static async findWorkspacesByUserId(id) {
    const query = `
      SELECT w.*
      FROM workspace w
      INNER JOIN user_workspaces uw ON w.id = uw.workspace_id
      WHERE uw.user_id = $1`;
    const { rows } = await pool.query(query, [id]);

    const detailedRows = await Promise.all(
      rows.map(async (row) => {
        const tasks = await Workspace.findTasksByWorkspaceId(row.id);
        const users = await Workspace.findUsersByWorkspaceId(row.id);
        return { ...row, tasks, users };
      })
    );

    return detailedRows;
  }
  static async addUserToWorkspace(userId, workspaceId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query =
        "INSERT INTO user_workspaces (user_id, workspace_id) VALUES ($1, $2)";
      await client.query(query, [userId, workspaceId]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  static async removeUserFromWorkspace(userId, workspaceId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query =
        "DELETE FROM user_workspaces WHERE user_id = $1 AND workspace_id = $2";
      await client.query(query, [userId, workspaceId]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default User;
