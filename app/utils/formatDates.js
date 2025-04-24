import { format, formatDistanceToNow, formatRelative } from "date-fns";
import { he } from "date-fns/locale";

// תאריך + שעה (לשדה createdAt)
export function formatDateWithTime(dateString) {
  if (!dateString) return "";
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: he });
}

// תאריך בלבד
export function formatDateOnly(dateString) {
  if (!dateString) return "";
  return format(new Date(dateString), "dd/MM/yyyy", { locale: he });
}

// תאריך מילולי: 10 באפריל 2025
export function formatDateInWords(dateString) {
  if (!dateString) return "";
  return format(new Date(dateString), "d 'ב'MMMM yyyy", { locale: he });
}

// תאריך כולל יום בשבוע: יום חמישי, 10 באפריל 2025
export function formatDateWithDayName(dateString) {
  if (!dateString) return "";
  return format(new Date(dateString), "EEEE, d 'ב'MMMM yyyy", { locale: he });
}

// מרחק מהיום – למשל: לפני יומיים
export function formatDistanceFromNow(dateString) {
  if (!dateString) return "";
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: he });
}

// תאריך יחסי – למשל: אתמול ב-16:00
export function formatRelativeDate(dateString) {
  if (!dateString) return "";
  return formatRelative(new Date(dateString), new Date(), { locale: he });
}
