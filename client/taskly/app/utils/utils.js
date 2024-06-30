import moment from "moment-timezone";
export const getUserTz = () => {
  return moment.tz.guess();
};

export function convertDateObjIntoDueDateType(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function compareDates(date1, date2) {}

export function isISODateString(dateStr) {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return isoRegex.test(dateStr);
}
