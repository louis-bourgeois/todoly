export const defaultRecurrence = { type: "none", days: [], endDate: null };
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

const parseDateOnly = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  if (typeof value === "string" && dateOnlyPattern.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const toDateKey = (value) => {
  const parsed = parseDateOnly(value);
  if (!parsed) return null;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const normalizeRecurrence = (recurrence) => {
  if (!recurrence || typeof recurrence !== "object") return defaultRecurrence;
  const allowedTypes = new Set(["none", "daily", "weekend", "custom"]);
  const type = allowedTypes.has(recurrence.type) ? recurrence.type : "custom";

  let days = Array.isArray(recurrence.days)
    ? recurrence.days
        .map((d) => Number(d))
        .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    : [];

  if (type === "daily") {
    days = [0, 1, 2, 3, 4, 5, 6];
  } else if (type === "weekend") {
    days = [0, 6];
  }

  const endDate = recurrence.endDate || null;

  return { type, days, endDate };
};

export const occursOnDate = (task, targetDate) => {
  if (!targetDate) return true;
  const recurrence = normalizeRecurrence(task?.recurrence);
  const startDateValue = task?.due_date || task?.dueDate;
  if (!startDateValue) return false;

  const startDate = parseDateOnly(startDateValue);
  const target = parseDateOnly(targetDate);
  if (!startDate || !target) {
    return false;
  }

  const startISO = toDateKey(startDate);
  const targetISO = toDateKey(target);

  if (recurrence.type === "none") {
    return startISO === targetISO;
  }

  if (recurrence.endDate) {
    const end = parseDateOnly(recurrence.endDate);
    if (end && target > end) return false;
  }

  if (target < startDate) return false;

  const activeDays =
    recurrence.days && recurrence.days.length > 0
      ? recurrence.days
      : recurrence.type === "daily"
      ? [0, 1, 2, 3, 4, 5, 6]
      : recurrence.type === "weekend"
      ? [0, 6]
      : [];

  return activeDays.includes(target.getDay());
};
