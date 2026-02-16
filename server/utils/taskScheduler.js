import Task from "../models/Task.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getNextRunDelay(targetHour = 2) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(targetHour, 5, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

export function scheduleTaskMaintenance() {
  const runMaintenance = async () => {
    try {
      await Task.autoRescheduleOverdueTasks();
    } catch (error) {
      console.error("Task maintenance failed:", error);
    }
  };

  const scheduleNext = () => {
    const delay = getNextRunDelay();
    setTimeout(async () => {
      await runMaintenance();
      scheduleNext();
    }, delay);
  };

  runMaintenance();
  scheduleNext();
}

export async function runTaskMaintenanceNow() {
  await Task.autoRescheduleOverdueTasks();
}
