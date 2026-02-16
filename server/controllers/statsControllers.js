import Task from "../models/Task.js";
import TaskActivity from "../models/TaskActivity.js";
import User from "../models/User.js";
import { normalizeRecurrence, occursOnDate } from "../utils/recurrence.js";

const parseIds = (value) =>
  typeof value === "string"
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : Array.isArray(value)
    ? value.filter(Boolean)
    : [];

const getRange = (timeframe = "week", weekStart = "Monday") => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate);
  let granularity = "day";

  const weekStartIndex = weekStart?.toLowerCase() === "sunday" ? 0 : 1;

  switch (timeframe) {
    case "month":
      startDate.setDate(endDate.getDate() - 29);
      break;
    case "year":
      startDate.setFullYear(endDate.getFullYear() - 1);
      granularity = "month";
      break;
    case "all":
      startDate.setDate(endDate.getDate() - 179);
      break;
    case "week":
    default: {
      const currentDay = endDate.getDay();
      const diff = (currentDay - weekStartIndex + 7) % 7;
      startDate.setDate(endDate.getDate() - diff);
      endDate.setDate(startDate.getDate() + 6);
      break;
    }
  }
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate, granularity, timeframe };
};

const buildBuckets = (startDate, endDate, granularity = "day") => {
  const buckets = [];
  const current = new Date(startDate);

  if (granularity === "month") {
    current.setDate(1);
    while (current <= endDate) {
      const bucketStart = new Date(current);
      const bucketEnd = new Date(current);
      bucketEnd.setMonth(bucketEnd.getMonth() + 1);
      bucketEnd.setMilliseconds(-1);
      buckets.push({
        start: bucketStart,
        end: bucketEnd,
        label: `${bucketStart.getFullYear()}-${String(
          bucketStart.getMonth() + 1
        ).padStart(2, "0")}`,
      });
      current.setMonth(current.getMonth() + 1);
    }
  } else {
    while (current <= endDate) {
      const bucketStart = new Date(current);
      const bucketEnd = new Date(current);
      bucketEnd.setHours(23, 59, 59, 999);
      buckets.push({
        start: bucketStart,
        end: bucketEnd,
        label: bucketStart.toISOString().slice(0, 10),
      });
      current.setDate(current.getDate() + 1);
    }
  }

  return buckets;
};

const filterTasks = (tasks, { workspaceIds, sectionIds, tagIds }) => {
  const workspaceSet = new Set(workspaceIds);
  const sectionSet = new Set(sectionIds);
  const tagSet = new Set(tagIds.map((t) => t.toLowerCase()));

  return tasks.filter((task) => {
    const workspaceOk =
      workspaceSet.size === 0 || workspaceSet.has(task.workspace_id);
    const sectionOk =
      sectionSet.size === 0 || sectionSet.has(task.linked_section);
    const tagOk =
      tagSet.size === 0 ||
      (Array.isArray(task.tags) &&
        task.tags.some(
          (tag) =>
            (tag.id && tagSet.has(String(tag.id))) ||
            (tag.name && tagSet.has(tag.name.toLowerCase()))
        ));
    return workspaceOk && sectionOk && tagOk;
  });
};

const getTaskWeight = (task, weightedPriority) =>
  weightedPriority ? Math.max(1, Number(task.priority) || 1) : 1;

const isRecurringTask = (task) => {
  const recurrence = normalizeRecurrence(task?.recurrence);
  return recurrence.type && recurrence.type !== "none";
};

const groupEventsByTask = (events = []) => {
  const map = new Map();
  events.forEach((event) => {
    if (!map.has(event.task_id)) map.set(event.task_id, []);
    map.get(event.task_id).push(event);
  });
  return map;
};

const completionForBucket = (
  task,
  bucket,
  weightedPriority,
  taskEvents,
  granularity
) => {
  const weight = getTaskWeight(task, weightedPriority);
  if (!taskEvents || taskEvents.length === 0) {
    if (task.status === "done") {
      const completionDate = task.last_completed_at
        ? new Date(task.last_completed_at)
        : null;
      if (!completionDate || completionDate <= bucket.end) {
        return weight;
      }
    }
    return 0;
  }

  const completedEvent = taskEvents.find((event) => {
    const date = new Date(event.event_date);
    if (granularity === "month") {
      return (
        date.getFullYear() === bucket.start.getFullYear() &&
        date.getMonth() === bucket.start.getMonth() &&
        event.event_type === "completed"
      );
    }
    return (
      event.event_type === "completed" &&
      date >= bucket.start &&
      date <= bucket.end
    );
  });

  return completedEvent ? weight : 0;
};

const buildSeries = ({
  tasks,
  events,
  buckets,
  weightedPriority,
  onlyRecurring,
  granularity,
}) => {
  const eventsByTask = groupEventsByTask(events);
  const completionSeries = [];
  const rescheduleSeries = [];

  buckets.forEach((bucket) => {
    const scheduledTasks = tasks.filter((task) => {
      if (onlyRecurring && !isRecurringTask(task)) return false;
      if (!task.due_date && !task.dueDate) return false;
      if (granularity === "month") {
        const due = new Date(task.due_date || task.dueDate);
        return (
          due.getFullYear() === bucket.start.getFullYear() &&
          due.getMonth() === bucket.start.getMonth()
        );
      }
      return occursOnDate(task, bucket.start);
    });

    const scheduledWeight = scheduledTasks.reduce(
      (acc, task) => acc + getTaskWeight(task, weightedPriority),
      0
    );

    const completedWeight = scheduledTasks.reduce((acc, task) => {
      const taskEvents = eventsByTask.get(task.id) || [];
      return (
        acc +
        completionForBucket(
          task,
          bucket,
          weightedPriority,
          taskEvents,
          granularity
        )
      );
    }, 0);

    const reschedulesInBucket = events.filter((event) => {
      if (event.event_type !== "auto_reschedule") return false;
      const date = new Date(event.event_date);
      if (granularity === "month") {
        return (
          date.getFullYear() === bucket.start.getFullYear() &&
          date.getMonth() === bucket.start.getMonth()
        );
      }
      return date >= bucket.start && date <= bucket.end;
    }).length;

    completionSeries.push({
      label: bucket.label,
      value:
        scheduledWeight > 0 ? completedWeight / scheduledWeight : null,
      scheduledWeight,
      completedWeight,
    });
    rescheduleSeries.push({
      label: bucket.label,
      value:
        scheduledWeight > 0
          ? reschedulesInBucket / scheduledWeight
          : reschedulesInBucket > 0
          ? reschedulesInBucket
          : null,
      scheduledWeight,
      count: reschedulesInBucket,
    });
  });

  const completionValues = completionSeries
    .map((d) => d.value)
    .filter((v) => v !== null);
  const rescheduleValues = rescheduleSeries
    .map((d) => d.value)
    .filter((v) => v !== null);

  const averageCompletion =
    completionValues.length > 0
      ? completionValues.reduce((a, b) => a + b, 0) /
        completionValues.length
      : 0;
  const averageReschedule =
    rescheduleValues.length > 0
      ? rescheduleValues.reduce((a, b) => a + b, 0) /
        rescheduleValues.length
      : 0;

  return {
    completionSeries,
    rescheduleSeries,
    averageCompletion,
    averageReschedule,
  };
};

const computeProductivityStreak = (series) => {
  let streak = 0;
  for (let i = series.length - 1; i >= 0; i--) {
    const point = series[i];
    if (point.value !== null && point.value >= 0.85) {
      streak += 1;
    } else if (point.scheduledWeight > 0) {
      break;
    }
  }
  return streak;
};

const computeRecurringHighlight = (tasks, events) => {
  const recurringTasks = tasks.filter((task) => isRecurringTask(task));
  if (recurringTasks.length === 0) return null;

  const eventsByTask = groupEventsByTask(events);

  const scored = recurringTasks.map((task) => {
    const taskEvents = eventsByTask.get(task.id) || [];
    const completions = taskEvents.filter(
      (e) => e.event_type === "completed"
    ).length;
    const reschedules = taskEvents.filter(
      (e) => e.event_type === "auto_reschedule"
    ).length;
    const completionCount =
      completions + (task.completion_count || 0);
    const denominator = completionCount + reschedules || 1;
    const score = completionCount / denominator;
    return {
      task,
      score,
      completions,
    };
  });

  return scored.sort((a, b) => b.score - a.score)[0];
};

export async function getStatistics(req, res) {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user?.[0]?.[0];
    if (!userId) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const timeframe = (req.query.timeframe || "week").toLowerCase();
    const metric = (req.query.metric || "completion").toLowerCase();
    const weightedPriority =
      req.query.weightedPriority === "true" ||
      req.query.weightedPriority === true;
    const onlyRecurring =
      req.query.onlyRecurring === "true" ||
      req.query.onlyRecurring === true;

    const preferences = await User.getPreferences(userId);
    const weekStartPref = preferences?.find
      ? preferences.find((p) => p.preference_key === "Week_Starts_On")
          ?.preference_value
      : preferences?.Week_Starts_On;
    const weekStart = weekStartPref || "Monday";

    const workspaceIds = parseIds(req.query.workspaceIds);
    const sectionIds = parseIds(req.query.sectionIds);
    const tagIds = parseIds(req.query.tagIds);

    const tasks = await Task.find(false, false, userId);
    const filteredTasks = filterTasks(tasks, {
      workspaceIds,
      sectionIds,
      tagIds,
    });

    const { startDate, endDate, granularity } = getRange(
      timeframe,
      weekStart
    );
    const buckets = buildBuckets(startDate, endDate, granularity);

    const events = await TaskActivity.fetchForTasks(
      filteredTasks.map((task) => task.id),
      {
        startDate,
        endDate,
        eventTypes: ["completed", "auto_reschedule", "manual_reschedule"],
      }
    );

    const series = buildSeries({
      tasks: filteredTasks,
      events,
      buckets,
      weightedPriority,
      onlyRecurring,
      granularity,
    });

    const streakSeries =
      granularity === "day"
        ? series.completionSeries
        : buildSeries({
            tasks: filteredTasks,
            events,
            buckets: buildBuckets(startDate, endDate, "day"),
            weightedPriority,
            onlyRecurring,
            granularity: "day",
          }).completionSeries;

    const streak = computeProductivityStreak(streakSeries);
    const recurringHighlight = computeRecurringHighlight(
      filteredTasks,
      events
    );

    const bestMonthBuckets = buildBuckets(
      new Date(new Date().getFullYear(), 0, 1),
      new Date(),
      "month"
    );
    const yearSeries = buildSeries({
      tasks: filteredTasks,
      events,
      buckets: bestMonthBuckets,
      weightedPriority,
      onlyRecurring,
      granularity: "month",
    });
    const bestMonthPoint = yearSeries.completionSeries.reduce(
      (best, point) => {
        if (point.value !== null && point.value > (best?.value ?? -1)) {
          return point;
        }
        return best;
      },
      null
    );

    res.status(200).json({
      range: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        granularity,
        timeframe,
      },
      metric,
      completion: {
        series: series.completionSeries,
        average: series.averageCompletion,
      },
      reschedule: {
        series: series.rescheduleSeries,
        average: series.averageReschedule,
      },
      summary: {
        productivityStreak: streak,
        dailyAverageCompletion: series.averageCompletion,
        overdueCount: filteredTasks.filter((t) => t.is_overdue).length,
        autoRescheduledCount: events.filter(
          (e) => e.event_type === "auto_reschedule"
        ).length,
        topRecurringTask: recurringHighlight
          ? {
              id: recurringHighlight.task.id,
              title: recurringHighlight.task.title,
              score: recurringHighlight.score,
              completions: recurringHighlight.completions,
            }
          : null,
        bestMonth: bestMonthPoint
          ? { label: bestMonthPoint.label, value: bestMonthPoint.value }
          : null,
      },
      options: {
        weightedPriority,
        onlyRecurring,
      },
      filters: {
        workspaceIds,
        sectionIds,
        tagIds,
      },
    });
  } catch (error) {
    console.error("Error computing statistics", error);
    res.status(500).json({ message: "Error computing statistics" });
  }
}
