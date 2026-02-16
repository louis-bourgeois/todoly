"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import SlickCarousel from "../../ui/app/SlickCarousel";
import Slide from "../../ui/app/Slide";
import PerformanceChart from "../../ui/app/statistics/PerformanceChart";
import StatsGrid from "../../ui/app/statistics/StatsGrid";
import StatsFilters from "../../ui/app/statistics/StatsFilters";
import DropdownMenu from "../../ui/app/MainMenu/settings/DropdownMenu";
import Switcher from "../../ui/app/MainMenu/settings/Switcher";
import { useScreen } from "../../../context/ScreenContext";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { useSection } from "../../../context/SectionContext";
import { useTag } from "../../../context/TagContext";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { useTranslation } from "../../i18n/client";

const baseUrl = "/api/stats/overview";

const timeframeOptions = ["week", "month", "year", "all"];

export default function StatistiquePage() {
  const { isMobile } = useScreen();
  const { workspaces } = useWorkspace();
  const { sections } = useSection();
  const { tags } = useTag();
  const { preferences } = useUserPreferences();
  const { t } = useTranslation();

  const metricChoices = useMemo(
    () => [
      { label: t("statistics.metric.completion"), value: "completion" },
      { label: t("statistics.metric.reschedule"), value: "reschedule" },
    ],
    [t]
  );

  const [metric, setMetric] = useState("completion");
  const [timeframe, setTimeframe] = useState("week");
  const [weightedPriority, setWeightedPriority] = useState(false);
  const [onlyRecurring, setOnlyRecurring] = useState(false);
  const [filters, setFilters] = useState({
    workspaces: [],
    sections: [],
    tags: [],
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl, {
        params: {
          timeframe,
          metric,
          weightedPriority,
          onlyRecurring,
          weekStart: preferences?.Week_Starts_On || "Monday",
          workspaceIds: filters.workspaces.join(","),
          sectionIds: filters.sections.join(","),
          tagIds: filters.tags.join(","),
        },
        withCredentials: true,
      });
      setData(response.data);
    } catch (error) {
      console.error("Unable to fetch stats", error);
    } finally {
      setLoading(false);
    }
  }, [timeframe, metric, weightedPriority, onlyRecurring, filters]);

  useEffect(() => {
    if (!isMobile) {
      fetchStats();
    }
  }, [fetchStats, isMobile]);

  const chartData = useMemo(() => {
    if (!data) return [];
    if (metric === "reschedule") {
      return data?.reschedule?.series || [];
    }
    return data?.completion?.series || [];
  }, [data, metric]);

  const chartColor = metric === "reschedule" ? "#ef4444" : "#2563eb";
  const handleFiltersApply = (nextFilters) => {
    setFilters(nextFilters);
  };

  if (isMobile) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    centerMode: true,
    centerPadding: "40px",
    slidesToScroll: 0.5,
    arrows: false,
  };

  return (
    <main className="h-[100vh]" role="main" aria-label={t("statistics.title")}>
      <SlickCarousel settings={settings}>
        <Slide index={0} key="stats-graph">
          <div className="flex flex-col h-full w-full px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-3 items-center">
                <DropdownMenu
                  title={
                    metricChoices.find((opt) => opt.value === metric)?.label ||
                    metric
                  }
                  options={metricChoices}
                  onSelect={(value) => setMetric(value)}
                  size="little"
                />
                <div className="flex gap-2">
                  {timeframeOptions.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-4 py-3 rounded-full text-sm transition-all duration-200 ${
                        timeframe === tf
                          ? "bg-dominant text-primary shadow-lg shadow-dominant/20 scale-105"
                          : "bg-primary text-text border border-white/10 hover:text-blue hover:scale-105"
                      }`}
                    >
                      {t(`statistics.timeframes.${tf}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="px-3 py-2 rounded-full bg-primary border border-white/10 hover:border-dominant transition text-text"
                >
                  {t("statistics.filters.open")}
                </button>
              </div>
            </div>

            {metric === "completion" && (
              <div className="flex gap-4 items-center mb-4 flex-wrap ">
                <label className="flex items-center gap-3 text-text text-sm bg-primary/60 border gradient-border px-3 py-2 rounded-full shadow-sm">
                  <Switcher
                    isChecked={weightedPriority}
                    onChange={(e) => setWeightedPriority(e.target.checked)}
                  />
                  <span>{t("statistics.options.weightedPriority")}</span>
                </label>
                <label className="flex items-center gap-3 text-text text-sm bg-primary/60 border gradient-border px-3 py-2 rounded-full shadow-sm">
                  <Switcher
                    isChecked={onlyRecurring}
                    onChange={(e) => setOnlyRecurring(e.target.checked)}
                  />
                  <span>{t("statistics.options.onlyRecurring")}</span>
                </label>
              </div>
            )}

            <div className="flex-1 bg-primary/40 border border-white/10 rounded-3xl shadow-shadow_card_desktop p-4 h-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-secondary">
                  {t("statistics.loading")}
                </div>
              ) : (
                <PerformanceChart
                  data={chartData}
                  color={chartColor}
                  emptyLabel={t("statistics.empty")}
                />
              )}
            </div>
          </div>
        </Slide>

        <Slide index={1} key="stats-grid">
          <div className="flex flex-col h-full w-full px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-text">
                {t("statistics.cards.title")}
              </h2>
              <button
                onClick={() => setFiltersOpen(true)}
                className="px-3 py-2 rounded-full bg-primary border border-white/10 hover:border-dominant transition text-text"
              >
                {t("statistics.filters.open")}
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-secondary">
                  {t("statistics.loading")}
                </div>
              ) : (
                <StatsGrid summary={data?.summary || {}} t={t} />
              )}
            </div>
          </div>
        </Slide>

        <Slide index={2} key="stats-upcoming">
          <div className="flex items-center justify-center h-full w-full px-8 py-6">
            <div className="bg-primary/60 border border-dashed border-white/20 rounded-3xl p-10 text-center max-w-xl">
              <p className="text-2xl font-bold text-text mb-3">
                {t("statistics.community.title")}
              </p>
              <p className="text-secondary">
                {t("statistics.community.subtitle")}
              </p>
            </div>
          </div>
        </Slide>
      </SlickCarousel>

      <StatsFilters
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={handleFiltersApply}
        tags={tags}
        sections={sections}
        workspaces={workspaces}
        initialFilters={filters}
        t={t}
      />
    </main>
  );
}
