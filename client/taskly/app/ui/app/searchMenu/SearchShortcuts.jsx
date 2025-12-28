import { useTranslation } from "../../../i18n/client";

const Keycap = ({ label }) => (
  <span className="px-2 py-1 rounded-md border border-secondary/30 bg-secondary/10 text-xs font-semibold tracking-wide uppercase text-text">
    {label}
  </span>
);

const SearchShortcuts = () => {
  const { t } = useTranslation();

  const shortcuts = [
    { keys: ["Ctrl", "K"], label: t("searchShortcuts.searchMenu") },
    { keys: ["Shift", "A"], label: t("searchShortcuts.addMenu") },
    { keys: ["Ctrl", "V"], label: t("searchShortcuts.viewsMenu") },
    { keys: ["Alt", "S"], label: t("searchShortcuts.settings") },
    { keys: ["Esc"], label: t("searchShortcuts.close") },
    { keys: ["↑", "↓", "Enter"], label: t("searchShortcuts.navigate") },
  ];

  return (
    <div className="w-full mt-3 rounded-2xl gradient-border bg-primary/80 text-text border border-secondary/10 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-[1.5vw] py-[1vw]">
        <div>
          <p className="text-sm font-semibold">{t("searchShortcuts.title")}</p>
          <p className="text-xs opacity-70">{t("searchShortcuts.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
          {shortcuts.slice(0, 3).map((shortcut, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/5 border border-secondary/15 text-xs"
            >
              {shortcut.keys.map((key, i) => (
                <Keycap key={`${shortcut.label}-${key}-${i}`} label={key} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 px-[1.5vw] pb-[1vw]">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/5 border border-secondary/10"
          >
            <div className="flex items-center gap-1">
              {shortcut.keys.map((key, idx) => (
                <Keycap key={`${shortcut.label}-${key}-${idx}`} label={key} />
              ))}
            </div>
            <span className="text-sm">{shortcut.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchShortcuts;
