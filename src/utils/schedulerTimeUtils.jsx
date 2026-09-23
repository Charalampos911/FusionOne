// src/utils/schedulerTimeUtils.js

const pad = (n) => n.toString().padStart(2, '0');

const formatDateDMY = (date) =>
  `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

const formatTimeHM = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

/**
 * Splits an opening span into calendar-day-aligned segments.
 *
 * @param {string} openDate - YYYY-MM-DD
 * @param {string} openStart - HH:mm:ss
 * @param {number} totalDurationMinutes
 * @returns {Array<{
 *   StartDate: string,
 *   StartTime: string,
 *   durationMinutes: number,
 *   EndTime: string,
 *   EndDate: string,
 *   CurrentDate: string
 * }>}
 */
export const splitOpenSpanByDay = (
  openDate,
  openStart,
  totalDurationMinutes
) => {
  const startDateTime = new Date(`${openDate}T${openStart}`);
  const finalEnd = new Date(startDateTime.getTime() + totalDurationMinutes * 60000);

  const segments = [];
  let cursor = new Date(startDateTime);

  while (cursor < finalEnd) {
    const dayEnd = new Date(cursor);
    dayEnd.setHours(24, 0, 0, 0);

    const segmentEnd = finalEnd < dayEnd ? finalEnd : dayEnd;
    const segmentDuration = (segmentEnd - cursor) / 60000;

    segments.push({
      StartDate: formatDateDMY(cursor),
      StartTime: formatTimeHM(cursor),
      durationMinutes: segmentDuration,
      EndTime: formatTimeHM(segmentEnd),
      EndDate: formatDateDMY(segmentEnd),
      CurrentDate: formatDateDMY(cursor)
    });

    cursor = segmentEnd;
  }

  return segments;
};

// Split day examples 
console.log(splitOpenSpanByDay("2026-02-27", "23:00:00", 480));

console.log(splitOpenSpanByDay("2026-02-15", "10:30:00", 5000));