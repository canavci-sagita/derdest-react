import { format, formatDistanceToNow } from "date-fns";
import { tr, enUS, et } from "date-fns/locale";
import type { Locale } from "date-fns";
import { DatePartDto } from "@/services/common/DatePartDto";

//TODO: Additional languages will be added here.
const locales: Record<string, Locale> = {
  tr: tr,
  en: enUS,
  et: et,
};

/**
 * Formats a date into a local date format.
 * @param lang The current language code (e.g., 'tr', 'en', 'et').
 * @param date The date which will be formatted.
 * @returns A formatted local date string.
 */
export const formatDate = (
  lang: string,
  date: Date,
  isLongDate: boolean,
  addTime: boolean
) => {
  if (!date) {
    return "-";
  }
  let formatString = isLongDate ? "MMMM dd, yyyy" : "MMM dd, yyyy";
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: isLongDate ? "long" : "short",
    day: "2-digit",
  };

  if (addTime) {
    formatString += " HH:mm";
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
    dateOptions.hourCycle = "h24";
  }
  const locale = locales[lang] || enUS;
  return format(date, formatString, { locale });
};

/**
 * Formats a date into a relative time string (e.g., "about 3 hours ago").
 * @param date The date which will be formatted.
 * @param lang The current language code (e.g., 'tr', 'en', 'et').
 * @returns A formatted relative time string.
 */
export const formatRelativeTime = (lang: string, date?: Date): string => {
  if (!date) {
    return "-";
  }

  const locale = locales[lang] || enUS;

  return formatDistanceToNow(date, { addSuffix: true, locale: locale });
};

/**
 * Format total seconds into readable time format.
 * @param seconds Total seconds elapsed
 * @returns
 */
export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Formats an date part object into a localized string.
 * Intelligently handles missing parts of the date.
 * @param lang The current language code (e.g., 'tr', 'en').
 * @param datePart The object containing day, month, and year.
 * @param longMonth: Long or short format of the month.
 * @returns A formatted, localized date string. (e.g., "March 2024" or "March 01, 2024").
 */
export function formatDatePart(
  lang: string,
  datePart: DatePartDto,
  longMonth: boolean
): string {
  if (!datePart || !datePart.year) {
    return "-";
  }

  const { day, month, year } = datePart;

  const date = new Date(year, (month || 1) - 1, day || 1);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
  };

  if (month) {
    options.month = longMonth ? "long" : "short";
  }
  if (day) {
    options.day = "2-digit";
  }

  const parts = new Intl.DateTimeFormat(lang, options).formatToParts(date);

  const dayValue = parts.find((p) => p.type === "day")?.value;
  const monthValue = parts.find((p) => p.type === "month")?.value;
  const yearValue = parts.find((p) => p.type === "year")?.value;

  const resultParts = [];
  if (monthValue) resultParts.push(monthValue + (!day ? "," : ""));
  if (dayValue) resultParts.push(dayValue + ",");
  if (yearValue) resultParts.push(yearValue);

  return resultParts.join(" ");
}
