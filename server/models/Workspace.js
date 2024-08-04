import pool from "../config/dbConfig.js";
import User from "./User.js";

class Workspace {
  constructor(name) {
    this.name = name;
  }

  async save(userId, sections) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertWorkspaceQuery =
        "INSERT INTO workspace (name) VALUES ($1) RETURNING id";
      const { rows } = await client.query(insertWorkspaceQuery, [this.name]);
      const workspaceId = rows[0].id;

      const insertUserWorkspaceQuery =
        "INSERT INTO user_workspaces (user_id, workspace_id) VALUES ($1, $2)";
      await client.query(insertUserWorkspaceQuery, [userId, workspaceId]);
      const insertDefaultSection =
        "INSERT INTO section (name, user_id, workspace_id) VALUES ($1, $2, $3) RETURNING id";

      const result = await client.query(insertDefaultSection, [
        "Other",
        userId,
        workspaceId,
      ]);

      if (sections) {
        await Promise.all(
          sections.map(async (section) => {
            await client.query(
              "UPDATE section SET workspace_id = $1 WHERE id = $2",
              [workspaceId, section.id]
            );

            const tasks = await client.query(
              "SELECT id FROM task WHERE linked_section = $1",
              [section.id]
            );

            await Promise.all(
              tasks.rows.map(async (task) => {
                await client.query(
                  "INSERT INTO task_workspaces (task_id, workspace_id) VALUES ($1, $2)",
                  [task.id, workspaceId]
                );
              })
            );
          })
        );
      }

      await client.query("COMMIT");

      return { workspaceId: workspaceId, defaultSection: result.rows[0].id };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, data) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Update workspace name
      await client.query("UPDATE workspace SET name = $1 WHERE id = $2", [
        data.name,
        id,
      ]);

      // 2. Update collaborators
      const currentCollaborators = await client.query(
        "SELECT user_id FROM user_workspaces WHERE workspace_id = $1",
        [id]
      );
      const currentCollaboratorIds = currentCollaborators.rows.map(
        (row) => row.user_id
      );

      // Resolve collaborator IDs
      const newCollaboratorIds = await Promise.all(
        data.collaborators.map(async (collaborator) => {
          if (collaborator.id) {
            return collaborator.id;
          } else if (collaborator.name) {
            const result = await User.findId(collaborator.name);
            if (result && result.length > 0) {
              return result[0][0]; // Assuming the first result is the correct one
            }
          }
          return null; // If we couldn't resolve an ID
        })
      );

      // Filter out any null values (unresolved IDs)
      const resolvedCollaboratorIds = newCollaboratorIds.filter(
        (id) => id !== null
      );

      // Remove collaborators
      for (const currentId of currentCollaboratorIds) {
        if (!resolvedCollaboratorIds.includes(currentId)) {
          await client.query(
            "DELETE FROM user_workspaces WHERE workspace_id = $1 AND user_id = $2",
            [id, currentId]
          );
        }
      }

      // Add new collaborators
      for (const newId of resolvedCollaboratorIds) {
        if (!currentCollaboratorIds.includes(newId)) {
          await client.query(
            "INSERT INTO user_workspaces (workspace_id, user_id) VALUES ($1, $2)",
            [id, newId]
          );
        }
      }

      // 3. Update sections
      const currentSections = await client.query(
        "SELECT id FROM section WHERE workspace_id = $1",
        [id]
      );
      const currentSectionIds = currentSections.rows.map((row) => row.id);

      const newSectionIds = data.linked_sections.map((section) => section.id);

      // Find the personal workspace id
      const personalWorkspace = await client.query(
        "SELECT id FROM workspace WHERE name = $1",
        ["Personal"]
      );
      const personalWorkspaceId = personalWorkspace.rows[0]?.id;

      if (!personalWorkspaceId) {
        console.error("Personal workspace not found");
        throw new Error("Personal workspace not found");
      }

      // Update sections
      for (const currentId of currentSectionIds) {
        if (!newSectionIds.includes(currentId)) {
          await client.query(
            "UPDATE section SET workspace_id = $1 WHERE id = $2",
            [personalWorkspaceId, currentId]
          );

          const tasksToMove = await client.query(
            "SELECT id FROM task WHERE linked_section = $1",
            [currentId]
          );
          for (const task of tasksToMove.rows) {
            await client.query(
              "UPDATE task_workspaces SET workspace_id = $1 WHERE task_id = $2",
              [personalWorkspaceId, task.id]
            );
          }
        }
      }

      for (const newSection of data.linked_sections) {
        if (!currentSectionIds.includes(newSection.id)) {
          await client.query(
            "UPDATE section SET workspace_id = $1 WHERE id = $2",
            [id, newSection.id]
          );

          const tasksToMove = await client.query(
            "SELECT id FROM task WHERE linked_section = $1",
            [newSection.id]
          );
          for (const task of tasksToMove.rows) {
            await client.query(
              "UPDATE task_workspaces SET workspace_id = $1 WHERE task_id = $2",
              [id, task.id]
            );
          }
        }
      }

      await client.query("COMMIT");
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
  static async deleteById(workspaceId, userId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Check if the user has permission to delete the workspace
      const permissionCheck = await client.query(
        "SELECT * FROM user_workspaces WHERE workspace_id = $1 AND user_id = $2",
        [workspaceId, userId]
      );
      if (permissionCheck.rows.length === 0) {
        throw new Error(
          "User does not have permission to delete this workspace"
        );
      }

      // Perform deletions in parallel
      const deletions = [
        client.query("DELETE FROM task_workspaces WHERE workspace_id = $1", [
          workspaceId,
        ]),
        client.query("DELETE FROM user_workspaces WHERE workspace_id = $1", [
          workspaceId,
        ]),
        client.query("DELETE FROM section WHERE workspace_id = $1", [
          workspaceId,
        ]),
        client.query("DELETE FROM workspace WHERE id = $1 RETURNING name", [
          workspaceId,
        ]),
      ];

      const results = await Promise.all(deletions);

      // Check if the workspace was actually deleted
      const deletedWorkspace = results[3].rows[0];
      if (!deletedWorkspace) {
        throw new Error("Workspace not found");
      }

      await client.query("COMMIT");
      return {
        message: "Workspace successfully deleted",
        deletedWorkspace: deletedWorkspace.name,
        affectedRows: {
          tasks: results[0].rowCount,
          users: results[1].rowCount,
          sections: results[2].rowCount,
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(
        `Error deleting workspace ${workspaceId}: ${error.message}`
      );
      throw new Error(
        `Error deleting workspace ${workspaceId}: ${error.message}`
      );
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
