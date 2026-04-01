import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeRecurrence } from "@/app/utils/recurrence";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";
import { useTranslation } from "../../../../i18n/client";

export function RecurrenceSelection({
  recurrence,
  onChange,
  menuOpen,
  setMenuOpen,
}) {
  const { t } = useTranslation();
  const [localRecurrence, setLocalRecurrence] = useState(
    normalizeRecurrence(recurrence)
  );

  useEffect(() => {
    setLocalRecurrence(normalizeRecurrence(recurrence));
  }, [recurrence]);

  const weekDays = useMemo(
    () => [
      { key: "mon", value: 1 },
      { key: "tue", value: 2 },
      { key: "wed", value: 3 },
      { key: "thu", value: 4 },
      { key: "fri", value: 5 },
      { key: "sat", value: 6 },
      { key: "sun", value: 0 },
    ],
    []
  );

  const summary = useMemo(() => {
    const daysLabel = weekDays
      .filter((day) => localRecurrence.days.includes(day.value))
      .map((day) => t(`recurrence.days.${day.key}`))
      .join(", ");
    switch (localRecurrence.type) {
      case "daily":
        return t("recurrence.daily");
      case "weekend":
        return t("recurrence.weekend");
      case "custom":
        return daysLabel
          ? `${t("recurrence.custom")}: ${daysLabel}`
          : t("recurrence.customPlaceholder");
      default:
        return t("recurrence.onlyThisTime");
    }
  }, [localRecurrence, t, weekDays]);

  const updateRecurrence = useCallback(
    (value) => {
      const normalized = normalizeRecurrence(value);
      setLocalRecurrence(normalized);
      onChange?.(normalized);
    },
    [onChange]
  );

  const handlePreset = (type) => {
    if (type === "none") {
      updateRecurrence({ type: "none", days: [], endDate: null });
    } else if (type === "daily") {
      updateRecurrence({ type: "daily", days: [0, 1, 2, 3, 4, 5, 6] });
    } else if (type === "weekend") {
      updateRecurrence({ type: "weekend", days: [0, 6] });
    }
    setMenuOpen(false);
  };

  const toggleDay = (dayValue) => {
    const currentDays = new Set(localRecurrence.days);
    if (currentDays.has(dayValue)) {
      currentDays.delete(dayValue);
    } else {
      currentDays.add(dayValue);
    }
    updateRecurrence({
      ...localRecurrence,
      type: "custom",
      days: Array.from(currentDays).sort(),
    });
  };

  const handleEndDateChange = (value) => {
    updateRecurrence({ ...localRecurrence, endDate: value || null });
  };

  const presetButtonClass = (isActive) =>
    `w-full rounded-full border px-3 py-2 text-sm font-semibold text-left transition-all duration-300 ${
      isActive
        ? "border-dominant text-dominant bg-dominant/10"
        : "border-secondary/40 text-text hover:text-dominant hover:border-dominant/60 hover:scale-[1.02]"
    }`;

  return (
    <TaskMenuSectionContainer
      allowOverflow
      othersStyles="rounded-full justify-between items-center min-h-[17.5%] relative cursor-pointer overflow-visible px-3 z-[1200]"
      onClick={() => setMenuOpen && setMenuOpen(!menuOpen)}
    >
      <div className="flex flex-col items-start pr-3 py-1 min-w-0">
        <span className="text-[10px] uppercase tracking-wide text-secondary/80 font-semibold">
          {t("recurrence.label")}
        </span>
        <h2 className="font-bold text-base 4xl:text-lg text-text leading-tight break-words">
          {summary}
        </h2>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer ${
          menuOpen ? "rotate-180" : ""
        } transition-transform duration-300 text-text`}
        viewBox="0 0 29 29"
        width="48"
        height="48"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d="m20.5 11.5-6 6-6-6"
        ></path>
      </svg>

      <div
        className={`absolute top-full mt-2 right-0 w-[max(100%,20rem)] max-w-[calc(100vw-3rem)] bg-primary shadow-lg rounded-2xl transition-all duration-200 origin-top z-[1300] ${
          menuOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-1 scale-[0.98] pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl m-1.5 p-3 sm:p-4 text-text gradient-border space-y-4 max-h-[min(70vh,32rem)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePreset("none")}
              className={presetButtonClass(localRecurrence.type === "none")}
            >
              {t("recurrence.onlyThisTime")}
            </button>
            <button
              onClick={() => handlePreset("daily")}
              className={presetButtonClass(localRecurrence.type === "daily")}
            >
              {t("recurrence.daily")}
            </button>
            <button
              onClick={() => handlePreset("weekend")}
              className={presetButtonClass(localRecurrence.type === "weekend")}
            >
              {t("recurrence.weekend")}
            </button>
            <button
              onClick={() =>
                updateRecurrence({
                  ...localRecurrence,
                  type: "custom",
                })
              }
              className={presetButtonClass(localRecurrence.type === "custom")}
            >
              {t("recurrence.custom")}
            </button>
          </div>

          {localRecurrence.type === "custom" && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-secondary uppercase tracking-wide">
                {t("recurrence.days.label")}
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const isActive = localRecurrence.days.includes(day.value);
                  return (
                    <button
                      key={day.key}
                      onClick={() => toggleDay(day.value)}
                      className={`group rounded-full border px-2 py-1.5 text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-dominant text-primary border-dominant"
                          : "border-secondary/50 text-text hover:border-dominant/70 hover:scale-105"
                      }`}
                    >
                      <span className="transition-colors duration-300 group-hover:text-dominant">
                        {t(`recurrence.days.${day.key}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs sm:text-sm font-semibold text-secondary uppercase tracking-wide">
              {t("recurrence.endDate")}
            </label>
            <input
              type="date"
              value={localRecurrence.endDate || ""}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="bg-transparent border border-secondary/60 rounded-xl px-3 py-2 text-text w-full focus:outline-none focus:border-dominant transition-colors"
            />
          </div>
        </div>
      </div>
    </TaskMenuSectionContainer>
  );
}
