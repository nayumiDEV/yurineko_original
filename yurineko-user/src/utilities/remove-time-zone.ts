export function removeTimeZone(date: Date) {
  return new Date(date.toISOString().slice(0, 19));
}