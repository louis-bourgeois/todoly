import pool from "../config/dbConfig.js";

import { compareObjects } from "../utils/compare.js";

import { isUUID } from "../utils/validate.js";

import Section from "./Section.js";

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

    workspaceId
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
  }

  async save() {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const linked_section = isUUID(this.linked_section)
        ? this.linked_section
        : (await Section.find(this.workspaceId, "Other"))[0].id;

      const insertTask =
        "INSERT INTO task (user_id,linked_section) VALUES ($1, $2) RETURNING id";

      const result = await client.query(insertTask, [
        this.owner_id,
        linked_section,
      ]);

      const taskId = result.rows[0].id;
      const insertTaskProp =
        "INSERT INTO task_properties (task_id, title, due_date, status, priority, user_id, tags, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";

      await client.query(insertTaskProp, [
        taskId,

        this.title,

        this.dueDate || null,

        this.status || null,
        this.priority,

        this.owner_id,

        this.tags,

        this.description,
      ]);

      const twQuery = `INSERT INTO task_workspaces (task_id, workspace_id) VALUES ($1,$2)`;
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
            "The title is too long, please make sure it doesn't exceed 32 characters!"
          );
      }
      throw e;
    } finally {
      client.release();
    }
  }
  static async find(workspaceId = false, taskId = false) {
    let query = `
      SELECT t.id, t.creation_date, tp.title, tp.due_date, tp.status, tp.priority, tp.tags, tp.description, t.linked_section, tw.workspace_id
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
    } else {
      return [];
    }

    try {
      const result = await pool.query(query, queryParams);

      result.rows = result.rows.map((row) => {
        if (row.due_date) {
          const dueDate = new Date(row.due_date);
          dueDate.setUTCDate(dueDate.getUTCDate() + 1); // Add one day in UTC

          const year = dueDate.getUTCFullYear();
          const month = String(dueDate.getUTCMonth() + 1).padStart(2, "0");
          const day = String(dueDate.getUTCDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;

          return {
            ...row,
            tags: JSON.stringify(row.tags),
            due_date: formattedDate,
          };
        } else {
          return {
            ...row,
            tags: JSON.stringify(row.tags),
          };
        }
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
      // Supprimer les propriétés de la tâche
      const deleteTaskPropertiesQuery =
        "DELETE FROM task_properties WHERE task_id = $1";

      await client.query(deleteTaskPropertiesQuery, [taskId]);

      // Supprimer la tâche elle-même
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
  static async update(updatedTask) {
    console.log("updated task id", updatedTask.id);
    const [currentTask] = await this.find(undefined, updatedTask.id);

    if (!currentTask) {
      console.error("Task not found (check Task.js in update)");
      throw new Error("Task not found");
    }

    const changes = compareObjects(currentTask, updatedTask);
    let columnsToUpdate = Object.keys(changes);

    // Determine if specific fields are updated
    const linkedSectionUpdated = columnsToUpdate.includes("linked_section");
    const workspaceIdUpdated = columnsToUpdate.includes("workspace_id");
    const dueDateUpdated = columnsToUpdate.includes("dueDate");

    // Handle dueDate to due_date conversion
    if (dueDateUpdated) {
      columnsToUpdate = columnsToUpdate.map((col) =>
        col === "dueDate" ? "due_date" : col
      );
    }

    // Tables to update based on the fields that have changed
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

    // Remove duplicates while keeping the last occurrence
    columnsToUpdate = columnsToUpdate
      .reverse()
      .filter((col, index, self) => self.indexOf(col) === index)
      .reverse();

    // Update the necessary tables
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
        queryParams.push(updatedTask.id);
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
