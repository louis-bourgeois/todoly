"use client"
import { useTranslation } from "@/app/i18n/client";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import Circle from "../Circle";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";
import { useRouter } from "next/navigation";

export default function Languages({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  const lng = preferences?.Language;
  const { t, i18n, ready } = useTranslation(lng);
  const router = useRouter();

  const handleUpdatePreference = async (key, value) => {
    try {
      await updatePreference({ key, value });
      if (key === "Language") {
        // We use window.location.href for a full page reload...
        window.location.href = "/app";
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la préférence:", error);
    }
  };

  const languageOptions = [
    { code: 'en', labelKey: 'languages.english' },
    { code: 'fr', labelKey: 'languages.french' },
  ];

  // --- AMÉLIORATION ICI ---
  // On s'assure d'avoir une valeur par défaut robuste même si les préférences sont en cours de chargement.
  const currentLanguageCode = preferences?.Language?.toLowerCase() || i18n.language;
  
  // On trouve l'option correspondante et on s'assure d'avoir un fallback pour la clé.
  const currentLanguageKey = languageOptions.find(opt => opt.code === currentLanguageCode)?.labelKey || 'languages.english';
  const currentLanguageLabel = t(currentLanguageKey);
  // --- FIN DE L'AMÉLIORATION ---

  const toggleDateFormat = () => {
    const newFormat = preferences?.Date_Format === "24h" ? "12h" : "24h";
    handleUpdatePreference("Date_Format", newFormat);
  };

  const toggleWeekStart = () => {
    const newDayStart = preferences?.Week_Starts_On === "Monday" ? "Sunday" : "Monday";
    handleUpdatePreference("Week_Starts_On", newDayStart);
  };

  // On peut s'assurer que les traductions sont prêtes avant d'afficher.
  if (!ready) {
    return <div>Loading...</div>; // Ou un composant de chargement plus élégant
  }

  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <SectionTitle>{t("settings.languages.title")}</SectionTitle>
      <DropdownMenu
        title={currentLanguageLabel}
        onSelect={(langCode) => handleUpdatePreference("Language", langCode)}
        options={languageOptions.map(opt => ({ label: t(opt.labelKey), value: opt.code }))}
      />

      <SectionTitle>{t("settings.timezone.title")}</SectionTitle>
      <DropdownMenu
        title={preferences?.TZ || "Europe/Paris"}
        onSelect={(newTz) => handleUpdatePreference("TZ", newTz)}
        options={["Europe/Paris", "America/New_York"]}
      />

      <div className="flex-col flex justify-start gap-[0.5vw] mb-5">
        <div className="flex justify-start w-full items-center gap-[2.5vw]">
          <Circle
            borderColor="dominant"
            onClick={toggleDateFormat}
            isSelected={preferences?.Date_Format === "12h"}
          />
          <h2 className="text-dominant font-bold">{t("settings.dateFormat.12h")}</h2>
        </div>
        <div className="flex justify-start w-full items-center gap-[2.5vw]">
          <Circle
            borderColor="dominant"
            onClick={toggleWeekStart}
            isSelected={preferences?.Week_Starts_On === "Sunday"}
          />
          <h2 className="text-dominant font-bold">
            {t("settings.weekStart.sunday")}
          </h2>
        </div>
      </div>
    </div>
  );
}