export type Holiday = { date: string; name: string; observed?: boolean };
export type HolidayCountry = 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR';

function formatDate(y: number, m: number, d: number): string {
  const mm = String(m + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

function nthWeekdayOfMonth(year: number, monthIndex: number, weekday: number, nth: number): Date {
  const first = new Date(year, monthIndex, 1);
  const firstWd = first.getDay();
  const delta = (weekday - firstWd + 7) % 7;
  const day = 1 + delta + (nth - 1) * 7;
  return new Date(year, monthIndex, day);
}

function lastWeekdayOfMonth(year: number, monthIndex: number, weekday: number): Date {
  const last = new Date(year, monthIndex + 1, 0);
  const lastWd = last.getDay();
  const delta = (lastWd - weekday + 7) % 7;
  return new Date(year, monthIndex, last.getDate() - delta);
}

function addObserved(holidays: Holiday[]): Holiday[] {
  const out: Holiday[] = [...holidays];
  holidays.forEach(h => {
    const [y, m, d] = h.date.split('-').map(v => parseInt(v, 10));
    const dt = new Date(y, m - 1, d);
    const wd = dt.getDay();
    if (wd === 0) {
      out.push({ date: formatDate(y, m - 1, d + 1), name: `${h.name} (Observed)`, observed: true });
    } else if (wd === 6) {
      out.push({ date: formatDate(y, m - 1, d - 1), name: `${h.name} (Observed)`, observed: true });
    }
  });
  return out;
}

function usHolidays(year: number): Holiday[] {
  const list: Holiday[] = [];
  list.push({ date: formatDate(year, 0, 1), name: "New Year's Day" });
  list.push({ date: formatDate(year, 5, 19), name: 'Juneteenth' });
  list.push({ date: formatDate(year, 6, 4), name: 'Independence Day' });
  list.push({ date: formatDate(year, 10, 11), name: 'Veterans Day' });
  list.push({ date: formatDate(year, 11, 25), name: 'Christmas Day' });

  const mlk = nthWeekdayOfMonth(year, 0, 1, 3);
  list.push({ date: formatDate(mlk.getFullYear(), mlk.getMonth(), mlk.getDate()), name: 'Martin Luther King Jr. Day' });
  const presidents = nthWeekdayOfMonth(year, 1, 1, 3);
  list.push({ date: formatDate(presidents.getFullYear(), presidents.getMonth(), presidents.getDate()), name: 'Presidents’ Day' });
  const memorial = lastWeekdayOfMonth(year, 4, 1);
  list.push({ date: formatDate(memorial.getFullYear(), memorial.getMonth(), memorial.getDate()), name: 'Memorial Day' });
  const labor = nthWeekdayOfMonth(year, 8, 1, 1);
  list.push({ date: formatDate(labor.getFullYear(), labor.getMonth(), labor.getDate()), name: 'Labor Day' });
  const columbus = nthWeekdayOfMonth(year, 9, 1, 2);
  list.push({ date: formatDate(columbus.getFullYear(), columbus.getMonth(), columbus.getDate()), name: 'Columbus Day' });
  const thanksgiving = nthWeekdayOfMonth(year, 10, 4, 4);
  list.push({ date: formatDate(thanksgiving.getFullYear(), thanksgiving.getMonth(), thanksgiving.getDate()), name: 'Thanksgiving Day' });

  return addObserved(list);
}

function empty(): Holiday[] { return []; }

export function listHolidaysByCountry(year: number, country: HolidayCountry): Holiday[] {
  switch (country) {
    case 'US':
      return usHolidays(year);
    case 'UK':
    case 'CA':
    case 'AU':
    case 'DE':
    case 'FR':
      return empty();
    default:
      return empty();
  }
}

export function getHolidaysMapForMonth(year: number, monthIndex: number, country: HolidayCountry): Record<number, string[]> {
  const list = listHolidaysByCountry(year, country);
  const out: Record<number, string[]> = {};
  list.forEach(h => {
    const dt = new Date(h.date);
    if (dt.getFullYear() === year && dt.getMonth() === monthIndex) {
      const day = dt.getDate();
      if (!out[day]) out[day] = [];
      out[day].push(h.name);
    }
  });
  return out;
}
