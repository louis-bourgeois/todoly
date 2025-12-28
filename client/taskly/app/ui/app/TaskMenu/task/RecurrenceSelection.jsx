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

  return (
    <TaskMenuSectionContainer
      allowOverflow
      othersStyles="rounded-full justify-between items-center h-[17.5%] relative cursor-pointer z-[-1] overflow-visible"
      onClick={() => setMenuOpen && setMenuOpen(!menuOpen)}
    >
      <div className="flex flex-col items-start pl-[4%] py-1">
        <span className="text-xs text-secondary uppercase tracking-wide">
          {t("recurrence.label")}
        </span>
        <h2 className="font-bold text-xl text-text">{summary}</h2>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer ${
          menuOpen ? "rotate-180" : ""
        } transition-transform duration-500 text-text`}
        viewBox="0 0 29 29"
        width="62.5"
        height="62.5"
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
        className={`absolute top-full mt-2 left-0 right-0 bg-primary shadow-lg rounded-lg transition-opacity duration-300 z-[1400] ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-xl m-2 p-4 text-text gradient-border space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePreset("none")}
              className="w-full select-none text-left font-bold hover:text-dominant transition-colors"
            >
              {t("recurrence.onlyThisTime")}
            </button>
            <button
              onClick={() => handlePreset("daily")}
              className="w-full text-left font-bold hover:text-dominant transition-colors"
            >
              {t("recurrence.daily")}
            </button>
            <button
              onClick={() => handlePreset("weekend")}
              className="w-full text-left font-bold hover:text-dominant transition-colors"
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
              className="w-full text-left font-bold hover:text-dominant transition-colors"
            >
              {t("recurrence.custom")}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-secondary uppercase">
              {t("recurrence.days.label")}
            </p>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isActive = localRecurrence.days.includes(day.value);
                return (
                  <button
                    key={day.key}
                    onClick={() => toggleDay(day.value)}
                    className={`rounded-full border px-2 py-1 text-sm transition ${
                      isActive
                        ? "bg-dominant text-primary border-dominant"
                        : "border-secondary text-text"
                    }`}
                  >
                    {t(`recurrence.days.${day.key}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-secondary uppercase">
              {t("recurrence.endDate")}
            </label>
            <input
              type="date"
              value={localRecurrence.endDate || ""}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="bg-transparent border border-secondary rounded-lg px-3 py-2 text-text focus:outline-none focus:border-dominant"
            />
          </div>
        </div>
      </div>
    </TaskMenuSectionContainer>
  );
}
