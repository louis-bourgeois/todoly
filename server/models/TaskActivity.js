import pool from "../config/dbConfig.js";

let taskActivityTableEnsured = false;

async function ensureTaskActivityTable(client = null) {
  if (taskActivityTableEnsured) return;
  const runner = client ? client.query.bind(client) : pool.query.bind(pool);

  await runner(
    `
    CREATE TABLE IF NOT EXISTS task_activity (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      task_id uuid NOT NULL REFERENCES task(id) ON DELETE CASCADE,
      user_id uuid NOT NULL,
      workspace_id uuid,
      event_type varchar(64) NOT NULL,
      event_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
      metadata jsonb DEFAULT '{}'::jsonb
    )
  `
  );
  taskActivityTableEnsured = true;
}

class TaskActivity {
  static async log(
    { taskId, userId, workspaceId = null, eventType, metadata = {}, eventDate },
    client = null
  ) {
    if (!taskId || !userId || !eventType) return;
    await ensureTaskActivityTable(client);
    const runner = client ? client.query.bind(client) : pool.query.bind(pool);
    const date = eventDate ? new Date(eventDate) : new Date();
    await runner(
      `
        INSERT INTO task_activity (task_id, user_id, workspace_id, event_type, event_date, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [taskId, userId, workspaceId, eventType, date, JSON.stringify(metadata)]
    );
  }

  static async fetchForTasks(taskIds = [], { startDate, endDate, eventTypes } = {}) {
    if (!Array.isArray(taskIds) || taskIds.length === 0) return [];
    await ensureTaskActivityTable();
    let query = `SELECT * FROM task_activity WHERE task_id = ANY($1::uuid[])`;
    const params = [taskIds];
    if (startDate) {
      params.push(startDate);
      query += ` AND event_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND event_date <= $${params.length}`;
    }
    if (eventTypes && eventTypes.length > 0) {
      params.push(eventTypes);
      query += ` AND event_type = ANY($${params.length}::text[])`;
    }
    query += " ORDER BY event_date ASC";

    const { rows } = await pool.query(query, params);
    return rows.map((row) => ({
      ...row,
      metadata:
        typeof row.metadata === "string"
          ? (() => {
              try {
                return JSON.parse(row.metadata);
              } catch {
                return {};
              }
            })()
          : row.metadata || {},
    }));
  }
}

export { ensureTaskActivityTable };
export default TaskActivity;
