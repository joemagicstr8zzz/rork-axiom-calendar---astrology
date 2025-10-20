import { StackCard } from '@/constants/stacks';
import { ZODIAC_SIGNS, ZodiacSign } from '@/constants/zodiac';
import { Week53Handling, WeekStandard } from '@/contexts/AppContext';

export const hashDate = (year: number, month: number, day: number, seed: number): number => {
  let hash = seed;
  hash = (hash * 31 + year) % 100000;
  hash = (hash * 31 + month) % 100000;
  hash = (hash * 31 + day) % 100000;
  return Math.abs(hash);
};

export const startOfWeek = (date: Date, weekStandard: WeekStandard, customStartDay: number = 1): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startDay = weekStandard === 'iso' ? 1 : weekStandard === 'us' ? 0 : customStartDay;
  const day = d.getDay();
  const diff = (day - startDay + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
};

export const getISOWeekNumber = (date: Date): number => {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((temp as any) - (yearStart as any)) / 86400000 + 1) / 7);
  return weekNo;
};

export const getUSWeekNumber = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 1);
  const startDay = start.getDay();
  const diff = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const week = Math.floor((diff + startDay) / 7) + 1;
  return week;
};

export const getWeekNumber = (
  date: Date,
  standard: WeekStandard,
  customStartDay: number = 1
): number => {
  if (standard === 'iso') return getISOWeekNumber(date);
  if (standard === 'us') return getUSWeekNumber(date);
  const start = startOfWeek(date, 'custom', customStartDay);
  const yearStart = startOfWeek(new Date(date.getFullYear(), 0, 1), 'custom', customStartDay);
  const diffDays = Math.floor((start.getTime() - yearStart.getTime()) / 86400000);
  return Math.floor(diffDays / 7) + 1;
};

export const normalizeWeekIndex = (
  week: number,
  handling: Week53Handling
): number => {
  if (week <= 52) return week;
  switch (handling) {
    case 'joker':
      return 53; // consumer decides
    case 'wrap1':
      return 1;
    case 'merge52':
    default:
      return 52;
  }
};

export const dateToWeekIndex = (
  date: Date,
  standard: WeekStandard,
  customStartDay: number,
  handling: Week53Handling
): number => {
  const raw = getWeekNumber(date, standard, customStartDay);
  return normalizeWeekIndex(raw, handling);
};

export const dateToCard = (
  date: Date,
  stack: StackCard[],
  seed: number = 12345,
  weekStandard: WeekStandard = 'iso',
  weekStartDay: number = 1,
  week53Handling: Week53Handling = 'merge52'
): StackCard | null => {
  if (!stack || stack.length === 0) return null;
  const weekIndex = dateToWeekIndex(date, weekStandard, weekStartDay, week53Handling);
  const targetPosition = Math.min(weekIndex, 52);
  const found = stack.find(c => c.position === targetPosition) || stack[0];
  return found;
};

export const dateToWeekCard = (
  date: Date,
  stack: StackCard[],
  weekStandard: WeekStandard,
  weekStartDay: number,
  week53Handling: Week53Handling
): { week: number; card: StackCard | null } => {
  const week = dateToWeekIndex(date, weekStandard, weekStartDay, week53Handling);
  const card = dateToCard(date, stack, 12345, weekStandard, weekStartDay, week53Handling);
  return { week, card };
};

export const weekNumberToRange = (
  year: number,
  week: number,
  standard: WeekStandard,
  customStartDay: number
): { start: Date; end: Date } => {
  let start: Date;
  if (standard === 'iso') {
    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const dayOfWeek = simple.getUTCDay() || 7;
    start = new Date(simple);
    start.setUTCDate(simple.getUTCDate() + 1 - dayOfWeek);
  } else if (standard === 'us') {
    const jan1 = new Date(year, 0, 1);
    const jan1Day = jan1.getDay();
    start = new Date(year, 0, 1 + (week - 1) * 7 - jan1Day);
  } else {
    const yearStart = startOfWeek(new Date(year, 0, 1), 'custom', customStartDay);
    start = new Date(yearStart.getFullYear(), yearStart.getMonth(), yearStart.getDate() + (week - 1) * 7);
  }
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

export const zodiacToStackIndex = (
  zodiacName: string,
  stackLength: number,
  seed: number = 12345
): number => {
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.name === zodiacName);
  if (signIndex === -1) return 1;
  const hash = (seed * 17 + signIndex * 13) % 100000;
  return (Math.abs(hash) % stackLength) + 1;
};

export const zodiacToCard = (
  zodiacName: string,
  stack: StackCard[],
  seed: number = 12345
): StackCard | null => {
  if (!stack || stack.length === 0) return null;
  const index = zodiacToStackIndex(zodiacName, stack.length, seed);
  return stack.find(card => card.position === index) || stack[0];
};

export const timeToStackIndex = (
  hour: number,
  minute: number,
  stackLength: number,
  seed: number = 12345
): number => {
  const totalMinutes = hour * 60 + minute;
  const bucket = Math.floor(totalMinutes / 15);
  const hash = (seed * 23 + bucket * 19) % 100000;
  return (Math.abs(hash) % stackLength) + 1;
};

export const timeToCard = (
  hour: number,
  minute: number,
  stack: StackCard[],
  seed: number = 12345
): StackCard | null => {
  if (!stack || stack.length === 0) return null;
  const index = timeToStackIndex(hour, minute, stack.length, seed);
  return stack.find(card => card.position === index) || stack[0];
};

export const cardToWeekRange = (
  card: StackCard,
  year: number,
  standard: WeekStandard,
  customStartDay: number
): { week: number; start: Date; end: Date } => {
  const week = Math.min(card.position, 52);
  const range = weekNumberToRange(year, week, standard, customStartDay);
  return { week, start: range.start, end: range.end };
};

export const parseCardInput = (input: string): StackCard | null => {
  const cleaned = input.trim().toUpperCase();
  const hashTagWeek = cleaned.match(/^#(\d{1,2})$/);
  if (hashTagWeek) {
    const num = parseInt(hashTagWeek[1], 10);
    if (num >= 1 && num <= 52) {
      return { position: num, label: `#${num}`, value: `${num}`, suit: '' } as unknown as StackCard;
    }
  }

  const match = cleaned.match(/^([2-9]|10|J|Q|K|A)([CDHS])$/);
  if (!match) return null;

  const [, value, suit] = match;
  return {
    position: 0,
    label: `${value}${suit}`,
    value,
    suit,
  };
};

export const multiCardToDateRange = (
  cards: StackCard[],
  seed: number = 12345,
  referenceYear: number = new Date().getFullYear()
): { startDate: Date; endDate: Date; specificDate: Date } => {
  if (cards.length === 0) {
    const now = new Date();
    return { startDate: now, endDate: now, specificDate: now };
  }

  const weeks = cards.map(c => Math.min(c.position, 52));
  const midWeek = weeks[Math.floor(weeks.length / 2)];
  const { start, end } = weekNumberToRange(referenceYear, midWeek, 'iso', 1);
  return { startDate: start, endDate: end, specificDate: start };
};

export const FOCUS_WORDS = [
  'Clarity', 'Balance', 'Growth', 'Insight', 'Harmony', 'Strength',
  'Wisdom', 'Patience', 'Courage', 'Peace', 'Focus', 'Trust',
  'Joy', 'Renewal', 'Purpose', 'Grace', 'Vision', 'Flow',
  'Connection', 'Alignment', 'Presence', 'Authenticity', 'Momentum', 'Serenity',
];

export const getFocusWord = (date: Date, seed: number = 12345): string => {
  const hash = hashDate(date.getFullYear(), date.getMonth() + 1, date.getDate(), seed);
  return FOCUS_WORDS[hash % FOCUS_WORDS.length];
};
