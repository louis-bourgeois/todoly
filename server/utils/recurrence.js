export const defaultRecurrence = { type: "none", days: [], endDate: null };

export const normalizeRecurrence = (recurrence) => {
  if (!recurrence || typeof recurrence !== "object") return defaultRecurrence;
  const allowedTypes = new Set(["none", "daily", "weekend", "custom"]);
  const type = allowedTypes.has(recurrence.type)
    ? recurrence.type
    : "custom";

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

  const startDate = new Date(startDateValue);
  const target = new Date(targetDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(target.getTime())) {
    return false;
  }

  const startISO = startDate.toISOString().slice(0, 10);
  const targetISO = target.toISOString().slice(0, 10);

  if (recurrence.type === "none") {
    return startISO === targetISO;
  }

  if (recurrence.endDate) {
    const end = new Date(recurrence.endDate);
    if (target > end) return false;
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
