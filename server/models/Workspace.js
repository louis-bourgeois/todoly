import pool from "../config/dbConfig.js";

class Workspace {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  async save(userId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertWorkspaceQuery =
        "INSERT INTO workspace (name, description) VALUES ($1, $2) RETURNING id";
      const { rows } = await client.query(insertWorkspaceQuery, [
        this.name,
        this.description,
      ]);
      const workspaceId = rows[0].id;

      const insertUserWorkspaceQuery =
        "INSERT INTO user_workspaces (user_id, workspace_id) VALUES ($1, $2)";
      await client.query(insertUserWorkspaceQuery, [userId, workspaceId]);

      await client.query("COMMIT");

      return workspaceId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM workspace WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
  static async deleteById(workspaceId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const deleteTaskAssociations =
        "DELETE FROM task_workspaces WHERE workspace_id = $1";
      await client.query(deleteTaskAssociations, [workspaceId]);
      const deleteUserAssociations =
        "DELETE FROM user_workspaces WHERE workspace_id = $1";
      await client.query(deleteUserAssociations, [workspaceId]);
      const deleteWorkspace = "DELETE FROM workspace WHERE id = $1";
      await client.query(deleteWorkspace, [workspaceId]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  static async findUsersByWorkspaceId(workspaceId) {
    const query = `
      SELECT u.*
      FROM user_profile u
      INNER JOIN user_workspaces uw ON u.id = uw.user_id
      WHERE uw.workspace_id = $1`;
    const { rows } = await pool.query(query, [workspaceId]);
    return rows;
  }
  static async findTasksByWorkspaceId(workspaceId) {
    try {
      const query = `
  SELECT t.id, t.creation_date, tp.title, tp.due_date, tp.status, tp.priority, tp.tags, tp.description, t.linked_section 
  FROM task t
  JOIN task_workspaces tw ON t.id = tw.task_id
  JOIN task_properties tp ON t.id = tp.task_id
  WHERE tw.workspace_id = $1
`;
      const { rows } = await pool.query(query, [workspaceId]);

      const updatedRows = rows.map((row) => {
        const dueDate = new Date(row.due_date);

        // Ajouter un jour en UTC
        dueDate.setUTCDate(dueDate.getUTCDate() + 1);

        // Obtenir la date au format "yyyy-MM-dd" en UTC
        const year = dueDate.getUTCFullYear();
        const month = String(dueDate.getUTCMonth() + 1).padStart(2, "0");
        const day = String(dueDate.getUTCDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        return {
          ...row,
          tags: JSON.stringify(row.tags),
          due_date: formattedDate,
        };
      });
      return updatedRows;
    } catch (error) {
      throw error;
    }
  }
}

export default Workspace;
