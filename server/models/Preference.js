import pool from "../config/dbConfig.js";

class Preference {
  constructor(key, value, userId) {
    this.key = key;
    this.value = value;
    this.userId = userId;
  }

  async save() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query =
        "INSERT INTO user_preferences (user_id, preference_key, preference_value) VALUES ($1, $2, $3)";
      await client.query(query, [this.userId, this.key, this.value]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(userId, key, newValue) {

    const client = await pool.connect();
    try {
      const query =
        "UPDATE user_preferences SET preference_value = $1 WHERE user_id = $2 AND preference_key = $3";
      await client.query(query, [newValue, userId, key]);
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  static async getUserPreferences(userId, keys = "*") {
    const client = await pool.connect();
    try {
      if (keys === "*") {
        const result = await client.query(
          "SELECT * FROM user_preferences WHERE user_id = $1",
          [userId]
        );
        return result.rows;
      } else {
        const placeholders = keys.map((_, index) => `$${index + 2}`).join(", ");
        const query = `SELECT preference_key, preference_value FROM user_preferences WHERE user_id = $1 AND preference_key IN (${placeholders})`;
        const result = await client.query(query, [userId, ...keys]);
        return result.rows;
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Preference;
