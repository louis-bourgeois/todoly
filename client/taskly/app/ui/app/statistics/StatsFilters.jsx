"use client";

import { useEffect, useMemo, useState } from "react";

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-text mb-3">{title}</h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const Chip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1 rounded-full border text-sm transition-all ${
      selected
        ? "bg-dominant text-primary border-dominant"
        : "bg-primary text-text border-white/10 hover:border-dominant"
    }`}
  >
    {label}
  </button>
);

export default function StatsFilters({
  isOpen,
  onClose,
  onApply,
  tags = [],
  sections = [],
  workspaces = [],
  initialFilters,
  t,
}) {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters, isOpen]);

  const sortedSections = useMemo(
    () =>
      [...sections].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ),
    [sections]
  );

  if (!isOpen) return null;

  const toggleValue = (key, value) => {
    setLocalFilters((prev) => {
      const current = new Set(prev[key] || []);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, [key]: Array.from(current) };
    });
  };

  const applyFilters = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-secondary-10 backdrop-blur-sm">
      <div className="w-[90vw] max-w-4xl bg-primary border border-white/10 rounded-3xl shadow-2xl p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">{t("statistics.filters.title")}</h2>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-secondary text-text hover:bg-secondary/80 transition"
            >
              {t("statistics.filters.cancel")}
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded-full bg-dominant text-primary hover:bg-dominant/90 transition"
            >
              {t("statistics.filters.apply")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title={t("statistics.filters.workspaces")}>
            {workspaces.map((w) => (
              <Chip
                key={w.id}
                label={w.name}
                selected={(localFilters.workspaces || []).includes(w.id)}
                onClick={() => toggleValue("workspaces", w.id)}
              />
            ))}
          </Section>
          <Section title={t("statistics.filters.sections")}>
            {sortedSections.map((s) => (
              <Chip
                key={s.id}
                label={s.name}
                selected={(localFilters.sections || []).includes(s.id)}
                onClick={() => toggleValue("sections", s.id)}
              />
            ))}
          </Section>
          <Section title={t("statistics.filters.tags")}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                selected={(localFilters.tags || []).includes(tag.id)}
                onClick={() => toggleValue("tags", tag.id)}
              />
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}
