import pool from "../config/dbConfig.js";
import { compareObjects } from "../utils/compare.js";
import { isUUID } from "../utils/validate.js";
import Section from "./Section.js";

let taskPropsColumnsEnsured = false;
async function ensureTaskPropertiesColumns(client = null) {
  if (taskPropsColumnsEnsured) return;
  const runner = client ? client.query.bind(client) : pool.query.bind(pool);
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS subtasks jsonb`
  );
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS recurrence jsonb DEFAULT '{"type":"none","days":[],"endDate":null}'::jsonb`
  );
  await runner(
    `UPDATE task_properties SET subtasks = '[]'::jsonb WHERE subtasks IS NULL`
  );
  await runner(
    `UPDATE task_properties SET recurrence = COALESCE(recurrence, '{"type":"none","days":[],"endDate":null}'::jsonb)`
  );
  taskPropsColumnsEnsured = true;
}

class Task {
  constructor(
    owner_id,
    title,
    status,
    linked_section,
    priority = 5,
    dueDate = undefined,
    tags = [],
    description,
    workspaceId,
    subtasks = [],
    recurrence = { type: "none", days: [], endDate: null }
  ) {
    this.owner_id = owner_id;
    this.title = title;
    this.status = status;
    this.priority = priority;
    this.dueDate = dueDate;
    this.tags = tags; 
    this.linked_section = linked_section;
    this.description = description;
    this.workspaceId = workspaceId;
    this.subtasks = subtasks;
    this.recurrence = recurrence;
  }

  async save() {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await ensureTaskPropertiesColumns(client);

      const linked_section = isUUID(this.linked_section)
        ? this.linked_section
        : (await Section.find(this.workspaceId, "Other"))[0].id;

      const insertTask =
        "INSERT INTO task (user_id, linked_section) VALUES ($1, $2) RETURNING id";
      const result = await client.query(insertTask, [
        this.owner_id,
        linked_section,
      ]);

      const taskId = result.rows[0].id;
      const insertTaskProp = `
        INSERT INTO task_properties (
          task_id,
          title,
          due_date,
          status,
          subtasks,
          priority,
          user_id,
          tags,
          description,
          recurrence
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;

      await client.query(insertTaskProp, [
        taskId,
        this.title,
        this.dueDate || null,
        this.status || null,
        JSON.stringify(this.subtasks || []),
        this.priority,
        this.owner_id,
        JSON.stringify(this.tags || []), 
        this.description,
        JSON.stringify(
          this.recurrence || { type: "none", days: [], endDate: null }
        ),
      ]);

      const twQuery = `INSERT INTO task_workspaces (task_id, workspace_id) VALUES ($1, $2)`;
      const twProps = [taskId, this.workspaceId];
      await client.query(twQuery, twProps);
      await client.query("COMMIT");
      return result.rows[0].id;
    } catch (e) {
      await client.query("ROLLBACK");
      console.error("Error saving task:", e);
      switch (e.code) {
        case "23505":
          throw new Error(
            `A task with the title ${this.title} already exists. Please use a unique title!`
          );
        case "22001":
          throw new Error(
            "The title is too long, please make sure it doesn't exceed 128 characters!"
          );
      }
      throw e;
    } finally {
      client.release();
    }
  }
  static async find(workspaceId = false, taskId = false, userId = false) {
    let query = `
      SELECT t.*, tp.*, tw.*
      FROM task t
      INNER JOIN task_properties tp ON t.id = tp.task_id
      INNER JOIN task_workspaces tw ON t.id = tw.task_id
    `;

    let queryParams = [];

    if (workspaceId && taskId) {
      query += " WHERE tw.workspace_id = $1 AND t.id = $2";
      queryParams = [workspaceId, taskId];
    } else if (workspaceId) {
      query += " WHERE tw.workspace_id = $1";
      queryParams = [workspaceId];
    } else if (taskId) {
      query += " WHERE t.id = $1";
      queryParams = [taskId];
    } else if (userId) {
      query += "WHERE t.user_id = $1";
      queryParams = [userId];
    } else {
      return [];
    }

    try {
      const result = await pool.query(query, queryParams);

      result.rows = result.rows.map((row) => {
        const parsedRow = { ...row };
        parsedRow.tags = Array.isArray(row.tags)
          ? row.tags
          : typeof row.tags === "string"
          ? (() => {
              try {
                return JSON.parse(row.tags);
              } catch {
                return [];
              }
            })()
          : [];

        parsedRow.subtasks = Array.isArray(row.subtasks)
          ? row.subtasks
          : typeof row.subtasks === "string"
          ? (() => {
              try {
                return JSON.parse(row.subtasks);
              } catch {
                return [];
              }
            })()
          : [];

        const defaultRecurrence = { type: "none", days: [], endDate: null };
        if (typeof row.recurrence === "string") {
          try {
            parsedRow.recurrence = JSON.parse(row.recurrence);
          } catch {
            parsedRow.recurrence = defaultRecurrence;
          }
        } else {
          parsedRow.recurrence = row.recurrence || defaultRecurrence;
        }
        
        if (row.due_date) {
          const dueDate = new Date(row.due_date);
          dueDate.setUTCDate(dueDate.getUTCDate() + 1);

          const year = dueDate.getUTCFullYear();
          const month = String(dueDate.getUTCMonth() + 1).padStart(2, "0");
          const day = String(dueDate.getUTCDate()).padStart(2, "0");
          parsedRow.due_date = `${year}-${month}-${day}`;
        }

        return parsedRow;
      });

      return result.rows;
    } catch (error) {
      console.error("Error executing find query:", error);
      throw error;
    }
  }

  static async delete(taskId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const deleteTaskWorkspacesQuery =
        "DELETE FROM task_workspaces WHERE task_id = $1";
      await client.query(deleteTaskWorkspacesQuery, [taskId]);

      const deleteTaskPropertiesQuery =
        "DELETE FROM task_properties WHERE task_id = $1";
      await client.query(deleteTaskPropertiesQuery, [taskId]);

      const deleteTaskQuery = "DELETE FROM task WHERE id = $1";
      await client.query(deleteTaskQuery, [taskId]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting task:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(taskToUpdate) {
    await ensureTaskPropertiesColumns();
    const [currentTask] = await this.find(undefined, taskToUpdate.id);

    if (!currentTask) {
      console.error("Task not found (check Task.js in update)");
      throw new Error("Task not found");
    }

    const changes = compareObjects(currentTask, taskToUpdate);
    const jsonColumns = ["tags", "subtasks", "recurrence"];
    jsonColumns.forEach((key) => {
      if (changes[key] !== undefined) {
        if (key === "recurrence" && changes[key] === null) {
          changes[key] = JSON.stringify({ type: "none", days: [], endDate: null });
          return;
        }
        if (Array.isArray(changes[key]) || typeof changes[key] === "object") {
          changes[key] = JSON.stringify(changes[key]);
        } else if (typeof changes[key] === "string") {
          try {
            JSON.parse(changes[key]);
          } catch (e) {
            changes[key] = JSON.stringify(key === "recurrence" ? { type: "none", days: [], endDate: null } : []);
          }
        } else {
          changes[key] = JSON.stringify(key === "recurrence" ? { type: "none", days: [], endDate: null } : []);
        }
      }
    });

    let columnsToUpdate = Object.keys(changes);

    
    const linkedSectionUpdated = columnsToUpdate.includes("linked_section");
    const workspaceIdUpdated = columnsToUpdate.includes("workspace_id");
    const dueDateUpdated = columnsToUpdate.includes("dueDate");

    
    if (dueDateUpdated) {
      columnsToUpdate = columnsToUpdate.map((col) =>
        col === "dueDate" ? "due_date" : col
      );
    }

    
    const tablesToUpdate = [];
    if (linkedSectionUpdated) {
      tablesToUpdate.push("task");
    }
    if (workspaceIdUpdated) {
      tablesToUpdate.push("task_workspaces");
    }
    if (
      columnsToUpdate.some(
        (col) => col !== "linked_section" && col !== "workspace_id"
      )
    ) {
      tablesToUpdate.push("task_properties");
    }

    
    columnsToUpdate = columnsToUpdate
      .reverse()
      .filter((col, index, self) => self.indexOf(col) === index)
      .reverse();

    
    for (const table of tablesToUpdate) {
      let setParts = [];
      let queryParams = [];
      let paramIndex = 1;

      for (const col of columnsToUpdate) {
        if (
          (table === "task" && col === "linked_section") ||
          (table === "task_workspaces" && col === "workspace_id") ||
          (table === "task_properties" &&
            col !== "linked_section" &&
            col !== "workspace_id")
        ) {
          setParts.push(`${col} = $${paramIndex++}`);
          queryParams.push(changes[col]);
        }
      }
      if (queryParams.length > 0) {
        queryParams.push(taskToUpdate.id);
        const sqlQuery = `UPDATE ${table} SET ${setParts.join(", ")} WHERE ${
          table !== "task" ? "task_id" : "id"
        } = $${paramIndex}`;
        await pool.query(sqlQuery, queryParams);
      }
    }
  }

  static async isTaskInWorkspace(taskId, workspaceId) {
    const query = `
      SELECT COUNT(*) 
      FROM task_workspaces 
      WHERE task_id = $1 AND workspace_id = $2
    `;
    const { rows } = await pool.query(query, [taskId, workspaceId]);
    return rows[0].count > 0;
  }

  static async addTaskToWorkspace(taskId, workspaceId) {
    const client = await pool.connect();
    try {
      const query =
        "INSERT INTO task_workspaces (task_id, workspace_id) VALUES ($1, $2)";
      await client.query(query, [taskId, workspaceId]);
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  static async removeTaskFromWorkspace(taskId, workspaceId) {
    const client = await pool.connect();
    try {
      const query =
        "DELETE FROM task_workspaces WHERE task_id = $1 AND workspace_id = $2";
      await client.query(query, [taskId, workspaceId]);
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Task;
