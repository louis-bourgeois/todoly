import { normalizeRecurrence } from "@/app/utils/recurrence";

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

const formatDateKey = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const offsetDateKey = (days) => {
  const nextDate = new Date();
  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() + days);
  return formatDateKey(nextDate);
};

const toTimestamp = (value, hour = 9) =>
  new Date(`${formatDateKey(value)}T${String(hour).padStart(2, "0")}:00:00Z`).toISOString();

const createId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const buildWorkspacesFromTasks = (workspaceMeta = [], tasks = []) =>
  workspaceMeta.map((workspace) => ({
    ...workspace,
    tasks: tasks.filter((task) => task.workspace_id === workspace.id),
  }));

export const createDemoSeed = () => {
  const today = offsetDateKey(0);
  const tomorrow = offsetDateKey(1);
  const yesterday = offsetDateKey(-1);
  const twoDaysAgo = offsetDateKey(-2);
  const threeDaysAgo = offsetDateKey(-3);
  const nextWeek = offsetDateKey(7);
  const inTenDays = offsetDateKey(10);
  const inThirtyDays = offsetDateKey(30);

  const tags = [
    { id: "tag-focus", name: "Focus" },
    { id: "tag-writing", name: "Writing" },
    { id: "tag-oral", name: "Oral" },
    { id: "tag-routine", name: "Routine" },
    { id: "tag-admin", name: "Admin" },
  ];

  const sections = [
    { id: "sec-prepa-priority", name: "Priority", workspace_id: "ws-prepa" },
    { id: "sec-prepa-oral", name: "Oral prep", workspace_id: "ws-prepa" },
    { id: "sec-prepa-other", name: "Other", workspace_id: "ws-prepa" },
    { id: "sec-personal-routine", name: "Routine", workspace_id: "ws-personal" },
    { id: "sec-personal-other", name: "Other", workspace_id: "ws-personal" },
    { id: "sec-product-roadmap", name: "Roadmap", workspace_id: "ws-product" },
    { id: "sec-product-other", name: "Other", workspace_id: "ws-product" },
  ];

  const workspaceMeta = [
    { id: "ws-prepa", name: "CPGE applications", users: [] },
    { id: "ws-product", name: "Todoly product", users: [] },
    { id: "ws-personal", name: "Personal", users: [] },
  ];

  const tasks = [
    {
      id: "task-letter",
      title: "Finalize motivation letter",
      description:
        "Polish the final paragraph, tighten the opening hook, and export the version sent to schools.",
      status: "in_progress",
      linked_section: "sec-prepa-priority",
      priority: 9,
      due_date: today,
      creation_date: twoDaysAgo,
      updated_at: toTimestamp(today, 9),
      tags: [tags[0], tags[1]],
      subtasks: [
        { id: "sub-letter-1", title: "Shorten introduction", done: true },
        { id: "sub-letter-2", title: "Check typography", done: false },
      ],
      recurrence: normalizeRecurrence({ type: "none" }),
      description_html: "",
      workspace_id: "ws-prepa",
      completion_count: 0,
      reschedule_count: 1,
      auto_reschedule_enabled: true,
      auto_reschedule_limit: 2,
      last_completed_at: null,
    },
    {
      id: "task-mock-interview",
      title: "Run a mock interview",
      description:
        "Review key talking points and rehearse concise answers before tomorrow's oral practice.",
      status: "todo",
      linked_section: "sec-prepa-oral",
      priority: 8,
      due_date: tomorrow,
      creation_date: yesterday,
      updated_at: toTimestamp(today, 11),
      tags: [tags[0], tags[2]],
      subtasks: [
        { id: "sub-oral-1", title: "Prepare opening answer", done: true },
        { id: "sub-oral-2", title: "Time the presentation", done: false },
      ],
      recurrence: normalizeRecurrence({ type: "none" }),
      workspace_id: "ws-prepa",
      completion_count: 0,
      reschedule_count: 0,
      auto_reschedule_enabled: true,
      auto_reschedule_limit: 2,
      last_completed_at: null,
    },
    {
      id: "task-reading-routine",
      title: "Read 20 minutes of philosophy",
      description:
        "A recurring reading block focused on Levinas and Jean-Paul Sartre to keep a concrete philosophy routine during application season.",
      status: "done",
      linked_section: "sec-personal-routine",
      priority: 6,
      due_date: today,
      creation_date: threeDaysAgo,
      updated_at: toTimestamp(today, 7),
      tags: [tags[0], tags[3]],
      subtasks: [],
      recurrence: normalizeRecurrence({
        type: "custom",
        days: [1, 2, 3, 4, 5, 6],
        endDate: inThirtyDays,
      }),
      workspace_id: "ws-personal",
      completion_count: 5,
      reschedule_count: 0,
      auto_reschedule_enabled: true,
      auto_reschedule_limit: 2,
      last_completed_at: today,
    },
    {
      id: "task-follow-up",
      title: "Send follow-up email",
      description:
        "A short admin task left overdue on purpose to make the dashboard feel realistic.",
      status: "todo",
      linked_section: "sec-prepa-other",
      priority: 5,
      due_date: yesterday,
      creation_date: threeDaysAgo,
      updated_at: toTimestamp(yesterday, 16),
      tags: [tags[4]],
      subtasks: [],
      recurrence: normalizeRecurrence({ type: "none" }),
      workspace_id: "ws-prepa",
      completion_count: 0,
      reschedule_count: 2,
      auto_reschedule_enabled: true,
      auto_reschedule_limit: 3,
      last_completed_at: null,
    },
    {
      id: "task-demo-cta",
      title: "Ship recruiter demo CTA",
      description:
        "Make the landing page usable without signup and keep the experience clean for reviewers.",
      status: "in_progress",
      linked_section: "sec-product-roadmap",
      priority: 8,
      due_date: nextWeek,
      creation_date: today,
      updated_at: toTimestamp(today, 14),
      tags: [tags[0]],
      subtasks: [
        { id: "sub-demo-1", title: "Design CTA copy", done: true },
        { id: "sub-demo-2", title: "Create demo session", done: false },
      ],
      recurrence: normalizeRecurrence({ type: "none" }),
      workspace_id: "ws-product",
      completion_count: 0,
      reschedule_count: 0,
      auto_reschedule_enabled: true,
      auto_reschedule_limit: 2,
      last_completed_at: null,
    },
    {
      id: "task-review-copy",
      title: "Review landing copy",
      description:
        "Tighten the product pitch so a recruiter understands the value in under ten seconds.",
      status: "done",
      linked_section: "sec-product-roadmap",
      priority: 7,
      due_date: twoDaysAgo,
      creation_date: threeDaysAgo,
      updated_at: toTimestamp(yesterday, 10),
      tags: [tags[1]],
      subtasks: [],
      recurrence: normalizeRecurrence({ type: "none" }),
      workspace_id: "ws-product",
      completion_count: 1,
      reschedule_count: 0,
      auto_reschedule_enabled: true,
      auto_reschedule_limit: 2,
      last_completed_at: twoDaysAgo,
    },
    {
      id: "task-math-drill",
      title: "Math drill set",
      description:
        "A second recurring task so the stats view has meaningful recurring data.",
      status: "todo",
      linked_section: "sec-prepa-priority",
      priority: 7,
      due_date: inTenDays,
      creation_date: threeDaysAgo,
      updated_at: toTimestamp(today, 18),
      tags: [tags[0], tags[3]],
      subtasks: [],
      recurrence: normalizeRecurrence({
        type: "custom",
        days: [1, 3, 5],
        endDate: inThirtyDays,
      }),
      workspace_id: "ws-prepa",
      completion_count: 3,
      reschedule_count: 1,
      auto_reschedule_enabled: true,
      auto_reschedule_limit: 2,
      last_completed_at: yesterday,
    },
  ];

  return deepClone({
    user: {
      id: "demo-user",
      first_name: "Demo",
      last_name: "Visitor",
      username: "demo-visitor",
      email: "contact@todoly.app",
      image_url: null,
      plan: "Free",
    },
    preferences: {
      Allow_Notification: "true",
      Color_Theme: "#000000",
      Current_Workspace: "ws-prepa",
      Daily_Recap: "true",
      Date_Format: "24h",
      Default_Main_Page: "Currently",
      Do_Not_Show_Add_Scroll_Popup_Again: "false",
      Home_Page_Title: "default",
      Language: "en",
      Last_Section: "sec-prepa-priority",
      Notifications_List: "Daily Recap,Weekly Recap",
      Show: "All tasks",
      Sort_By: "Creation date",
      TZ: "Europe/Paris",
      Week_Starts_On: "Monday",
    },
    workspaceMeta,
    sections,
    tags,
    tasks,
  });
};

const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" && dateOnlyPattern.test(value)) {
    return new Date(`${value}T00:00:00`);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const matchesFilters = (task, filters = {}) => {
  const workspaceMatch =
    !filters.workspaces?.length ||
    filters.workspaces.includes(task.workspace_id);
  const sectionMatch =
    !filters.sections?.length ||
    filters.sections.includes(task.linked_section);
  const tagMatch =
    !filters.tags?.length ||
    task.tags.some((tag) => filters.tags.includes(tag.id));

  return workspaceMatch && sectionMatch && tagMatch;
};

const isTaskVisibleInTimeframe = (taskDate, startDate) => {
  if (!taskDate) return false;
  return taskDate >= startDate;
};

const buildTimeBuckets = (timeframe) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (timeframe === "week") {
    return [...Array(7)].map((_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      return {
        label: new Intl.DateTimeFormat("en-US", {
          weekday: "short",
        }).format(date),
        start: new Date(date),
        end: new Date(date),
      };
    });
  }

  if (timeframe === "month") {
    return [...Array(4)].map((_, index) => {
      const end = new Date(now);
      end.setDate(now.getDate() - (3 - index) * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      return {
        label: `W${index + 1}`,
        start,
        end,
      };
    });
  }

  const months = timeframe === "year" ? 6 : 8;
  return [...Array(months)].map((_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    return {
      label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        monthDate
      ),
      start: monthDate,
      end,
    };
  });
};

const taskFallsInBucket = (task, bucket) => {
  const taskDate = parseDate(task.last_completed_at || task.due_date || task.creation_date);
  if (!taskDate) return false;
  return taskDate >= bucket.start && taskDate <= bucket.end;
};

const computeCompletionValue = (bucketTasks, weightedPriority) => {
  if (bucketTasks.length === 0) return 0;
  const numerator = bucketTasks.reduce((sum, task) => {
    const weight = weightedPriority ? Math.max(1, Number(task.priority || 1)) : 1;
    return sum + (task.status === "done" ? weight : 0);
  }, 0);
  const denominator = bucketTasks.reduce((sum, task) => {
    const weight = weightedPriority ? Math.max(1, Number(task.priority || 1)) : 1;
    return sum + weight;
  }, 0);
  return denominator > 0 ? numerator / denominator : 0;
};

const computeRescheduleValue = (bucketTasks) => {
  if (bucketTasks.length === 0) return 0;
  const totalReschedules = bucketTasks.reduce(
    (sum, task) => sum + Math.max(0, Number(task.reschedule_count || 0)),
    0
  );
  return Math.max(0, Math.min(1, totalReschedules / Math.max(bucketTasks.length * 2, 1)));
};

const computeProductivityStreak = (tasks) => {
  const completionDates = new Set(
    tasks
      .filter((task) => task.status === "done" && task.last_completed_at)
      .map((task) => formatDateKey(task.last_completed_at))
  );

  let streak = 0;
  for (let offset = 0; offset < 30; offset += 1) {
    const dateKey = offsetDateKey(-offset);
    if (!completionDates.has(dateKey)) {
      if (offset === 0) continue;
      break;
    }
    streak += 1;
  }
  return streak;
};

const computeBestMonth = (tasks) => {
  const buckets = buildTimeBuckets("all");
  const monthly = buckets
    .map((bucket) => {
      const bucketTasks = tasks.filter((task) => taskFallsInBucket(task, bucket));
      return {
        label: bucket.label,
        value: computeCompletionValue(bucketTasks, false),
      };
    })
    .filter((entry) => entry.value > 0);

  if (monthly.length === 0) return null;

  return monthly.reduce((best, current) =>
    current.value > best.value ? current : best
  );
};

export const buildDemoStats = ({
  tasks = [],
  filters = {},
  timeframe = "week",
  weightedPriority = false,
  onlyRecurring = false,
} = {}) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const timeframeStart = (() => {
    const start = new Date(now);
    if (timeframe === "week") start.setDate(now.getDate() - 6);
    else if (timeframe === "month") start.setDate(now.getDate() - 27);
    else if (timeframe === "year") start.setMonth(now.getMonth() - 5);
    else start.setMonth(now.getMonth() - 7);
    return start;
  })();

  const filteredTasks = tasks.filter((task) => {
    const recurrenceType = task?.recurrence?.type || "none";
    const taskDate = parseDate(task.last_completed_at || task.due_date || task.creation_date);
    if (!matchesFilters(task, filters)) return false;
    if (onlyRecurring && recurrenceType === "none") return false;
    if (!isTaskVisibleInTimeframe(taskDate, timeframeStart)) return false;
    return true;
  });

  const buckets = buildTimeBuckets(timeframe);
  const completionSeries = buckets.map((bucket) => {
    const bucketTasks = filteredTasks.filter((task) => taskFallsInBucket(task, bucket));
    return {
      label: bucket.label,
      value: computeCompletionValue(bucketTasks, weightedPriority),
    };
  });

  const rescheduleSeries = buckets.map((bucket) => {
    const bucketTasks = filteredTasks.filter((task) => taskFallsInBucket(task, bucket));
    return {
      label: bucket.label,
      value: computeRescheduleValue(bucketTasks),
    };
  });

  const overdueCount = filteredTasks.filter((task) => {
    const dueDate = parseDate(task.due_date);
    return dueDate && dueDate < now && task.status !== "done";
  }).length;

  const recurringTasks = filteredTasks.filter(
    (task) => task?.recurrence?.type && task.recurrence.type !== "none"
  );

  const topRecurringTask = recurringTasks
    .map((task) => ({
      title: task.title,
      score: Number(task.recurrence_consistency || 0),
    }))
    .sort((a, b) => b.score - a.score)[0];

  return {
    completion: { series: completionSeries },
    reschedule: { series: rescheduleSeries },
    summary: {
      dailyAverageCompletion:
        completionSeries.reduce((sum, point) => sum + point.value, 0) /
        Math.max(completionSeries.length, 1),
      productivityStreak: computeProductivityStreak(filteredTasks),
      topRecurringTask: topRecurringTask || null,
      bestMonth: computeBestMonth(filteredTasks),
      overdueCount,
      autoRescheduledCount: filteredTasks.filter(
        (task) =>
          task.auto_reschedule_enabled &&
          Number(task.reschedule_count || 0) > 0
      ).length,
    },
  };
};

export const createDemoTask = (taskData, currentWorkspace, existingTags = []) => {
  const nextDateKey = formatDateKey(new Date());
  const rawTags = Array.isArray(taskData.tags) ? taskData.tags : [];
  const tags = rawTags.map((tag) => {
    if (tag?.id && tag?.name) return tag;
    if (typeof tag === "string") {
      return (
        existingTags.find((existingTag) => existingTag.name === tag) || {
          id: createId("tag"),
          name: tag,
        }
      );
    }
    return {
      id: createId("tag"),
      name: tag?.name || "Tag",
    };
  });

  return {
    id: createId("task"),
    title: taskData.title || "Untitled task",
    description: taskData.description || "",
    status: taskData.status || "todo",
    linked_section: taskData.linked_section || "",
    priority: Number(taskData.priority || 5),
    due_date: taskData.dueDate || taskData.due_date || nextDateKey,
    creation_date: nextDateKey,
    updated_at: new Date().toISOString(),
    tags,
    subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : [],
    recurrence: normalizeRecurrence(taskData.recurrence),
    workspace_id: taskData.workspaceId || taskData.workspace_id || currentWorkspace,
    completion_count: taskData.status === "done" ? 1 : 0,
    reschedule_count: 0,
    auto_reschedule_enabled: true,
    auto_reschedule_limit: 2,
    last_completed_at: taskData.status === "done" ? nextDateKey : null,
  };
};
