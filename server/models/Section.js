import pool from "../config/dbConfig.js";

class Section {
  constructor(name, user_id, workspaceId) {
    this.name = name;
    this.user_id = user_id;
    this.workspaceId = workspaceId;
  }

  async save() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query =
        "INSERT INTO section (name, user_id, workspace_id) VALUES ($1, $2, $3) RETURNING workspace_id";

      const values = [this.name, this.user_id, this.workspaceId];

      const r = await client.query(query, values);

      await client.query("COMMIT");
      return r;
    } catch (error) {
      await client.query("ROLLBACK");

      throw error;
    } finally {
      client.release();
    }
  }

  static async find(
    workspaceId = undefined,
    name = undefined,
    sectionId = undefined,
    userId = undefined
  ) {
    if (!workspaceId && !sectionId && !userId) {
      throw new Error(
        "You have to provide a parameter (name | workspaceId or sectionId)!"
      );
    }
    try {
      const query = userId
        ? "SELECT * FROM section WHERE user_id = $1"
        : sectionId
        ? "SELECT * FROM section WHERE id = $1"
        : name
        ? "SELECT * FROM section WHERE name = $1 AND workspace_id = $2"
        : "SELECT * FROM section WHERE workspace_id = $1";

      const params = userId
        ? [userId]
        : sectionId
        ? [sectionId]
        : name
        ? [name, workspaceId]
        : [workspaceId];

      const { rows } = await pool.query(query, params);

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async update(newName, sectionId, userId) {
    const [currentSection] = await this.find(undefined, undefined, sectionId);

    if (!currentSection) {
      console.error("Section not found (Section.update)");
      throw new Error("Section not found");
    }
    if (newName === currentSection.name) {
      return;
    }
    const query = `UPDATE section SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *`;
    const params = [newName, sectionId, userId];

    try {
      const response = await pool.query(query, params);
      return response;
    } catch (error) {
      throw new Error("Failed to update section");
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const deleteQuery = "DELETE FROM section WHERE id = $1";
      await client.query(deleteQuery, [id]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "23503") {
        // Lever une erreur spécifique pour être attrapée par le contrôleur
        throw new Error(
          "You cannot delete this section because there are still tasks in it!"
        );
      }
      throw error;
    } finally {
      client.release();
    }
  }
  static async setWorkspaceId(workspaceId, sectionId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const setQuery = `UPDATE section SET workspace_id = $1 WHERE id = $2`;
      await client.query(setQuery, [workspaceId, sectionId]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
}

export default Section;
