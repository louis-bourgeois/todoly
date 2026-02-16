"use client";

export default function StatsGrid({ summary = {}, t }) {
  const cards = [
    {
      key: "average",
      title: t("statistics.cards.dailyAverage"),
      value: `${Math.round((summary.dailyAverageCompletion || 0) * 100)}%`,
      accent: "from-dominant to-ternary",
    },
    {
      key: "streak",
      title: t("statistics.cards.productivityStreak"),
      value: `${summary.productivityStreak || 0} ${t(
        "statistics.cards.days"
      )}`,
      accent: "from-ternary to-blue",
    },
    summary.topRecurringTask && {
      key: "recurring",
      title: t("statistics.cards.topRecurring"),
      value: summary.topRecurringTask.title,
      helper: `${Math.round((summary.topRecurringTask.score || 0) * 100)}%`,
      accent: "from-rose-400 to-amber-300",
    },
    summary.bestMonth && {
      key: "bestMonth",
      title: t("statistics.cards.bestMonth"),
      value: summary.bestMonth.label,
      helper: summary.bestMonth.value
        ? `${Math.round(summary.bestMonth.value * 100)}%`
        : "--",
      accent: "from-blue to-dominant",
    },
    {
      key: "overdue",
      title: t("statistics.cards.overdue"),
      value: `${summary.overdueCount || 0}`,
      accent: "from-important to-rose-400",
    },
    {
      key: "autoRescheduled",
      title: t("statistics.cards.autoRescheduled"),
      value: `${summary.autoRescheduledCount || 0}`,
      accent: "from-amber-300 to-orange-400",
    },
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-12 gap-5 w-full h-full">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`col-span-12 md:col-span-6 lg:col-span-4 bg-primary/60 border border-white/10 rounded-3xl p-6 shadow-shadow_card_desktop relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 opacity-40 bg-gradient-to-br ${card.accent}`}
          />
          <div className="relative">
            <p className="text-secondary text-sm mb-2">{card.title}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-text">{card.value}</p>
              {card.helper && (
                <span className="text-sm px-3 py-1 rounded-full bg-primary/70 border border-white/10 text-text">
                  {card.helper}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
