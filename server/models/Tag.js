import pool from "../config/dbConfig.js";

class Tag {
  constructor(name, user_id) {
    this.name = name;
    this.user_id = user_id;
  }

  async save() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query =
        "INSERT INTO tag (name, user_id) VALUES ($1, $2) RETURNING id";
      const result = await client.query(query, [this.name, this.user_id]);
      await client.query("COMMIT");
      return result.rows[0].id;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async find(user_id = undefined, name = undefined, tagId = undefined) {
    if (!user_id && !tagId) {
      throw new Error(
        "You have to provide a parameter (name | userId or tagId)!"
      );
    }
    try {
      let query, params;
      if (tagId) {
        query = "SELECT * FROM tag WHERE id = $1";
        params = [tagId];
      } else if (name) {
        query =
          "SELECT * FROM tag WHERE LOWER(name) = LOWER($1) AND user_id = $2";
        params = [name, user_id];
      } else {
        query = "SELECT * FROM tag WHERE user_id = $1";
        params = [user_id];
      }
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(newName, tagId) {
    const query = "UPDATE tag SET name = $1 WHERE id = $2";
    const params = [newName, tagId];

    try {
      await pool.query(query, params);
    } catch (error) {
      console.error("Error updating tag:", error);
      throw new Error("Failed to update tag");
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const deleteQuery = "DELETE FROM tag WHERE id = $1";
      await client.query(deleteQuery, [id]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "23503") {
        throw new Error(
          "You cannot delete this tag because there are still tasks associated with it!"
        );
      }
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Tag;
