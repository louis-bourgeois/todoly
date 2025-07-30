
import { formatInTimeZone } from "date-fns-tz";
import { useUserPreferences } from "../../context/UserPreferencesContext";

export const useFormattedDate = () => {
  const { preferences } = useUserPreferences();

  const formatADate = (date, formatString) => {
    if (!date) {
      return "";
    }

    let d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
      console.error("Invalid date provided to formatADate:", date);
      return "";
    }

    const timeZone = preferences?.TZ || "Europe/Paris";
    let customFormat = formatString;

    if (!customFormat) {
      customFormat = preferences?.Date_Format === "12h" ? "MM/dd/yyyy hh:mm a" : "dd/MM/yyyy HH:mm";
    } else if (customFormat === 'hh:mm a' || customFormat === 'HH:mm') {
      try {
        return d.toLocaleTimeString([], { timeZone, hour: '2-digit', minute:'2-digit', hour12: customFormat.includes('a') });
      } catch (error) {
        if (error instanceof RangeError) {
          console.warn(`Invalid time zone specified: ${timeZone}. Falling back to local time.`);
          return d.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: customFormat.includes('a') });
        }
        throw error;
      }
    }

    try {
      return formatInTimeZone(d, timeZone, customFormat);
    } catch (error) {
      console.error("Error formatting date:", { date: d, timeZone, customFormat, error });
      return "";
    }
  };

  return { formatADate };
};
