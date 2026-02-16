import pool from "../config/dbConfig.js";
import { compareObjects } from "../utils/compare.js";
import { normalizeRecurrence, occursOnDate } from "../utils/recurrence.js";
import { isUUID } from "../utils/validate.js";
import Section from "./Section.js";
import TaskActivity from "./TaskActivity.js";

let taskPropsColumnsEnsured = false;
let taskPropsSchemaVersion = 0;
const TASK_PROPS_SCHEMA_VERSION = 2;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const TASK_COLUMNS = new Set(["linked_section"]);
const TASK_WORKSPACES_COLUMNS = new Set(["workspace_id"]);
const TASK_PROPERTIES_COLUMNS = new Set([
  "title",
  "due_date",
  "status",
  "subtasks",
  "priority",
  "tags",
  "description",
  "recurrence",
  "is_overdue",
  "reschedule_count",
  "auto_reschedule_limit",
  "auto_reschedule_enabled",
  "last_rescheduled_at",
  "last_completed_at",
  "completion_count",
]);

const toDateOnlyString = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    if (dateOnlyPattern.test(value)) {
      return value;
    }
    const leadingDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (leadingDate?.[1]) {
      return leadingDate[1];
    }
  }
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

async function ensureTaskPropertiesColumns(client = null) {
  if (taskPropsColumnsEnsured && taskPropsSchemaVersion >= TASK_PROPS_SCHEMA_VERSION) {
    return;
  }
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
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS is_overdue boolean DEFAULT false`
  );
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS reschedule_count integer DEFAULT 0`
  );
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS auto_reschedule_limit integer`
  );
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS auto_reschedule_enabled boolean DEFAULT true`
  );
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS last_rescheduled_at timestamp`
  );
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS last_completed_at timestamp`
  );
  await runner(
    `ALTER TABLE IF EXISTS task_properties ADD COLUMN IF NOT EXISTS completion_count integer DEFAULT 0`
  );
  await runner(
    `UPDATE task_properties 
      SET 
        is_overdue = COALESCE(is_overdue, false),
        reschedule_count = COALESCE(reschedule_count, 0),
        auto_reschedule_enabled = COALESCE(auto_reschedule_enabled, true),
        completion_count = COALESCE(completion_count, 0)
    `
  );
  taskPropsColumnsEnsured = true;
  taskPropsSchemaVersion = TASK_PROPS_SCHEMA_VERSION;
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
    recurrence = { type: "none", days: [], endDate: null },
    extendedProps = {}
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
    this.is_overdue = extendedProps.is_overdue ?? false;
    this.reschedule_count = extendedProps.reschedule_count ?? 0;
    this.auto_reschedule_limit =
      extendedProps.auto_reschedule_limit ?? null;
    this.auto_reschedule_enabled =
      extendedProps.auto_reschedule_enabled ?? true;
    this.last_rescheduled_at = extendedProps.last_rescheduled_at ?? null;
    this.last_completed_at = extendedProps.last_completed_at ?? null;
    this.completion_count = extendedProps.completion_count ?? 0;
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
          recurrence,
          is_overdue,
          reschedule_count,
          auto_reschedule_limit,
          auto_reschedule_enabled,
          last_rescheduled_at,
          last_completed_at,
          completion_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
        this.is_overdue,
        this.reschedule_count,
        this.auto_reschedule_limit,
        this.auto_reschedule_enabled,
        this.last_rescheduled_at,
        this.last_completed_at,
        this.completion_count,
      ]);

      const twQuery = `INSERT INTO task_workspaces (task_id, workspace_id) VALUES ($1, $2)`;
      const twProps = [taskId, this.workspaceId];
      await client.query(twQuery, twProps);

      await TaskActivity.log(
        {
          taskId,
          userId: this.owner_id,
          workspaceId: this.workspaceId,
          eventType: "created",
          metadata: {
            dueDate: this.dueDate || null,
            priority: this.priority,
            recurrence: this.recurrence,
          },
        },
        client
      );
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
    await ensureTaskPropertiesColumns();
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
        
        parsedRow.due_date = toDateOnlyString(row.due_date);

        parsedRow.is_overdue = !!row.is_overdue;
        parsedRow.reschedule_count = Number(row.reschedule_count || 0);
        parsedRow.auto_reschedule_limit =
          row.auto_reschedule_limit !== null &&
          row.auto_reschedule_limit !== undefined
            ? Number(row.auto_reschedule_limit)
            : null;
        parsedRow.auto_reschedule_enabled =
          row.auto_reschedule_enabled !== undefined
            ? !!row.auto_reschedule_enabled
            : true;
        parsedRow.last_rescheduled_at = row.last_rescheduled_at;
        parsedRow.last_completed_at = row.last_completed_at;
        parsedRow.completion_count = Number(row.completion_count || 0);

        return parsedRow;
      });

      return result.rows;
    } catch (error) {
      if (error.code === "42703") {
        console.error("Missing columns detected during find(), retrying ensure", error);
        await ensureTaskPropertiesColumns();
        const result = await pool.query(query, queryParams);
        return result.rows;
      }
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

  static async update(taskToUpdate, alreadyRetried = false) {
    const client = await pool.connect();
    let sanitizedTask;
    let inTransaction = false;
    try {
      sanitizedTask = { ...taskToUpdate };
      delete sanitizedTask.recurrence_consistency;
      delete sanitizedTask.recurrenceConsistency;
      const completionContextDate = toDateOnlyString(
        sanitizedTask.completion_context_date ||
          sanitizedTask.completionContextDate ||
          new Date()
      );
      delete sanitizedTask.completion_context_date;
      delete sanitizedTask.completionContextDate;

      await ensureTaskPropertiesColumns();
      const [currentTask] = await this.find(undefined, sanitizedTask.id);

      if (!currentTask) {
        console.error("Task not found (check Task.js in update)");
        throw new Error("Task not found");
      }

      await client.query("BEGIN");
      inTransaction = true;
      const now = new Date();
      let statusChangedToDone =
        sanitizedTask.status === "done" && currentTask.status !== "done";
      const updatedDue = sanitizedTask.due_date || sanitizedTask.dueDate;
      const currentDue = currentTask.due_date || currentTask.dueDate;
      const updatedDueDate = toDateOnlyString(updatedDue);
      const currentDueDate = toDateOnlyString(currentDue);
      const currentCompletedDate = toDateOnlyString(currentTask.last_completed_at);
      const effectiveRecurrence = normalizeRecurrence(
        sanitizedTask.recurrence || currentTask.recurrence
      );
      const isRecurringTask = effectiveRecurrence.type !== "none";
      const effectiveDueDate = updatedDueDate || currentDueDate;
      const todayDate = toDateOnlyString(now);
      const isTodayCompletion =
        !!completionContextDate && completionContextDate === todayDate;
      const isValidCompletionDate =
        !isRecurringTask ||
        (isTodayCompletion &&
          completionContextDate &&
          occursOnDate(
            { due_date: effectiveDueDate, recurrence: effectiveRecurrence },
            completionContextDate
          ));

      const dueDateChanged =
        !!updatedDueDate && currentDueDate !== updatedDueDate;

      let statusChangedFromDone =
        sanitizedTask.status === "todo" && currentTask.status === "done";

      if (statusChangedToDone && isRecurringTask && !isValidCompletionDate) {
        sanitizedTask.status = currentTask.status;
        statusChangedToDone = false;
      }

      if (statusChangedToDone) {
        sanitizedTask.last_completed_at = completionContextDate || now;
        sanitizedTask.completion_count = (currentTask.completion_count || 0) + 1;
        sanitizedTask.is_overdue = false;
      }

      if (statusChangedFromDone) {
        if (isRecurringTask) {
          const canUndoSameOccurrence =
            completionContextDate &&
            currentCompletedDate &&
            completionContextDate === currentCompletedDate;

          if (!canUndoSameOccurrence) {
            sanitizedTask.status = currentTask.status;
            statusChangedFromDone = false;
          } else {
            sanitizedTask.last_completed_at = null;
            sanitizedTask.completion_count = Math.max(
              0,
              (currentTask.completion_count || 0) - 1
            );
          }
        } else {
          sanitizedTask.last_completed_at = null;
          sanitizedTask.completion_count = Math.max(
            0,
            (currentTask.completion_count || 0) - 1
          );
        }
      }

      const changes = compareObjects(currentTask, sanitizedTask);
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

      const normalizedChanges = { ...changes };
      if (Object.prototype.hasOwnProperty.call(normalizedChanges, "dueDate")) {
        normalizedChanges.due_date = toDateOnlyString(normalizedChanges.dueDate);
        delete normalizedChanges.dueDate;
      }
      delete normalizedChanges.completion_context_date;
      delete normalizedChanges.completionContextDate;
      delete normalizedChanges.recurrence_consistency;
      delete normalizedChanges.recurrenceConsistency;

      const taskChanges = {};
      const taskWorkspaceChanges = {};
      const taskPropertiesChanges = {};

      Object.entries(normalizedChanges).forEach(([col, value]) => {
        if (TASK_COLUMNS.has(col)) {
          taskChanges[col] = value;
          return;
        }
        if (TASK_WORKSPACES_COLUMNS.has(col)) {
          taskWorkspaceChanges[col] = value;
          return;
        }
        if (TASK_PROPERTIES_COLUMNS.has(col)) {
          taskPropertiesChanges[col] = value;
        }
      });

      const runUpdate = async (table, idColumn, payload) => {
        const entries = Object.entries(payload);
        if (entries.length === 0) return;
        const setParts = [];
        const queryParams = [];

        entries.forEach(([col, value], index) => {
          setParts.push(`${col} = $${index + 1}`);
          queryParams.push(value);
        });

        queryParams.push(taskToUpdate.id);
        const sqlQuery = `UPDATE ${table} SET ${setParts.join(
          ", "
        )} WHERE ${idColumn} = $${entries.length + 1}`;
        await client.query(sqlQuery, queryParams);
      };

      await runUpdate("task", "id", taskChanges);
      await runUpdate("task_workspaces", "task_id", taskWorkspaceChanges);
      await runUpdate("task_properties", "task_id", taskPropertiesChanges);

      const workspaceId =
        sanitizedTask.workspace_id || currentTask.workspace_id || null;

      if (statusChangedToDone) {
        await TaskActivity.log(
          {
            taskId: sanitizedTask.id,
            userId: currentTask.user_id,
            workspaceId,
            eventType: "completed",
            metadata: {
              priority: sanitizedTask.priority ?? currentTask.priority,
              dueDate: updatedDueDate || currentDueDate,
              recurrence: sanitizedTask.recurrence || currentTask.recurrence,
            },
            eventDate: now,
          },
          client
        );
      }

      if (dueDateChanged && !statusChangedToDone) {
        await TaskActivity.log(
          {
            taskId: sanitizedTask.id,
            userId: currentTask.user_id,
            workspaceId,
            eventType: "manual_reschedule",
            metadata: {
              from: currentDueDate,
              to: updatedDueDate,
              priority: taskToUpdate.priority ?? currentTask.priority,
            },
            eventDate: now,
          },
          client
        );
      }

      await client.query("COMMIT");
      inTransaction = false;
      const [updatedTask] = await this.find(undefined, sanitizedTask.id);
      return updatedTask || null;
    } catch (error) {
      if (inTransaction) {
        await client.query("ROLLBACK");
      }
      if (error.code === "42703") {
        console.error("Missing columns detected, retrying column creation", error);
        taskPropsColumnsEnsured = false;
        taskPropsSchemaVersion = 0;
        await ensureTaskPropertiesColumns();
        if (!alreadyRetried) {
          return await Task.update(sanitizedTask || taskToUpdate, true);
        }
      }
      throw error;
    } finally {
      client.release();
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

  static async autoRescheduleOverdueTasks() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await ensureTaskPropertiesColumns(client);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDate = toDateOnlyString(today);

      const overdueQuery = `
        SELECT 
          t.id, 
          t.user_id, 
          tp.due_date, 
          tp.status, 
          tp.priority, 
          tp.recurrence, 
          tp.reschedule_count, 
          tp.auto_reschedule_limit, 
          tp.auto_reschedule_enabled,
          tw.workspace_id
        FROM task t
        INNER JOIN task_properties tp ON t.id = tp.task_id
        INNER JOIN task_workspaces tw ON t.id = tw.task_id
        WHERE tp.due_date IS NOT NULL
          AND tp.status <> 'done'
          AND tp.due_date < $1
          AND COALESCE(tp.auto_reschedule_enabled, true) = true
          AND COALESCE(tp.recurrence->>'type', 'none') = 'none'
      `;

      const { rows } = await client.query(overdueQuery, [todayDate]);

      for (const row of rows) {
        const limit = row.auto_reschedule_limit;
        const reachedLimit =
          limit !== null && limit !== undefined && row.reschedule_count >= limit;

        if (reachedLimit) {
          await client.query(
            `UPDATE task_properties 
              SET is_overdue = true
              WHERE task_id = $1`,
            [row.id]
          );
          continue;
        }

        const newDueDate = todayDate;
        const newCount = Number(row.reschedule_count || 0) + 1;
        const now = new Date();

        await client.query(
          `UPDATE task_properties 
            SET 
              due_date = $1,
              is_overdue = true,
              reschedule_count = $2,
              last_rescheduled_at = $3
            WHERE task_id = $4`,
          [newDueDate, newCount, now, row.id]
        );

        await TaskActivity.log(
          {
            taskId: row.id,
            userId: row.user_id,
            workspaceId: row.workspace_id,
            eventType: "auto_reschedule",
            metadata: {
              fromDueDate: row.due_date,
              toDueDate: newDueDate,
              priority: row.priority,
            },
            eventDate: now,
          },
          client
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error while auto-rescheduling overdue tasks:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Task;
