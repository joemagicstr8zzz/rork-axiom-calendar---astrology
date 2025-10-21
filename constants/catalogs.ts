export type CatalogItem = { id: string; label: string; value: string | number; color?: string; emoji?: string };

export const CARDS_CATALOG: CatalogItem[] = (() => {
  const suits = [
    { code: 'C', name: 'Clubs', emoji: '♣️' },
    { code: 'D', name: 'Diamonds', emoji: '♦️' },
    { code: 'H', name: 'Hearts', emoji: '♥️' },
    { code: 'S', name: 'Spades', emoji: '♠️' },
  ] as const;
  const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'] as const;
  const arr: CatalogItem[] = [];
  suits.forEach((s) => {
    values.forEach((v) => {
      const label = `${v}${s.code}`;
      arr.push({ id: label, label, value: label, emoji: s.emoji });
    });
  });
  return arr;
})();

export const ESP_CATALOG: CatalogItem[] = [
  { id: 'Circle', label: 'Circle', value: 'Circle', emoji: '⭕' },
  { id: 'Cross', label: 'Cross', value: 'Cross', emoji: '✚' },
  { id: 'Waves', label: 'Wavy Lines', value: 'Wavy Lines', emoji: '≈' },
  { id: 'Square', label: 'Square', value: 'Square', emoji: '◻️' },
  { id: 'Star', label: 'Star', value: 'Star', emoji: '★' },
];

export const COLORS_CATALOG: CatalogItem[] = [
  { id: 'Red', label: 'Red', value: 'Red', color: '#EF4444' },
  { id: 'Blue', label: 'Blue', value: 'Blue', color: '#3B82F6' },
  { id: 'Green', label: 'Green', value: 'Green', color: '#10B981' },
  { id: 'Yellow', label: 'Yellow', value: 'Yellow', color: '#F59E0B' },
  { id: 'Purple', label: 'Purple', value: 'Purple', color: '#8B5CF6' },
  { id: 'Orange', label: 'Orange', value: 'Orange', color: '#F97316' },
  { id: 'Pink', label: 'Pink', value: 'Pink', color: '#EC4899' },
  { id: 'Brown', label: 'Brown', value: 'Brown', color: '#92400E' },
  { id: 'Black', label: 'Black', value: 'Black', color: '#111827' },
  { id: 'White', label: 'White', value: 'White', color: '#FFFFFF' },
  { id: 'Gray', label: 'Gray', value: 'Gray', color: '#6B7280' },
  { id: 'Cyan', label: 'Cyan', value: 'Cyan', color: '#06B6D4' },
  { id: 'Magenta', label: 'Magenta', value: 'Magenta', color: '#DB2777' },
];

export const NUMBERS_CATALOG: CatalogItem[] = Array.from({ length: 10 }).map((_, i) => ({ id: String(i), label: String(i), value: i }));

export const ZODIAC_CATALOG: CatalogItem[] = [
  { id: 'Aries', label: 'Aries', value: 'Aries', emoji: '♈' },
  { id: 'Taurus', label: 'Taurus', value: 'Taurus', emoji: '♉' },
  { id: 'Gemini', label: 'Gemini', value: 'Gemini', emoji: '♊' },
  { id: 'Cancer', label: 'Cancer', value: 'Cancer', emoji: '♋' },
  { id: 'Leo', label: 'Leo', value: 'Leo', emoji: '♌' },
  { id: 'Virgo', label: 'Virgo', value: 'Virgo', emoji: '♍' },
  { id: 'Libra', label: 'Libra', value: 'Libra', emoji: '♎' },
  { id: 'Scorpio', label: 'Scorpio', value: 'Scorpio', emoji: '♏' },
  { id: 'Sagittarius', label: 'Sagittarius', value: 'Sagittarius', emoji: '♐' },
  { id: 'Capricorn', label: 'Capricorn', value: 'Capricorn', emoji: '♑' },
  { id: 'Aquarius', label: 'Aquarius', value: 'Aquarius', emoji: '♒' },
  { id: 'Pisces', label: 'Pisces', value: 'Pisces', emoji: '♓' },
];

export const BIRTHSTONES_CATALOG: CatalogItem[] = [
  { id: 'Jan', label: 'Garnet (Jan)', value: 'Garnet', color: '#8B0000' },
  { id: 'Feb', label: 'Amethyst (Feb)', value: 'Amethyst', color: '#9966CC' },
  { id: 'Mar', label: 'Aquamarine (Mar)', value: 'Aquamarine', color: '#7FFFD4' },
  { id: 'Apr', label: 'Diamond (Apr)', value: 'Diamond', color: '#E5E7EB' },
  { id: 'May', label: 'Emerald (May)', value: 'Emerald', color: '#10B981' },
  { id: 'Jun', label: 'Pearl (Jun)', value: 'Pearl', color: '#F3F4F6' },
  { id: 'Jul', label: 'Ruby (Jul)', value: 'Ruby', color: '#DC2626' },
  { id: 'Aug', label: 'Peridot (Aug)', value: 'Peridot', color: '#A3E635' },
  { id: 'Sep', label: 'Sapphire (Sep)', value: 'Sapphire', color: '#1D4ED8' },
  { id: 'Oct', label: 'Opal (Oct)', value: 'Opal', color: '#93C5FD' },
  { id: 'Nov', label: 'Topaz (Nov)', value: 'Topaz', color: '#F59E0B' },
  { id: 'Dec', label: 'Turquoise (Dec)', value: 'Turquoise', color: '#14B8A6' },
];

export const ELEMENTS_CATALOG: CatalogItem[] = [
  { id: 'Fire', label: 'Fire', value: 'Fire', emoji: '🔥' },
  { id: 'Water', label: 'Water', value: 'Water', emoji: '💧' },
  { id: 'Earth', label: 'Earth', value: 'Earth', emoji: '🌍' },
  { id: 'Air', label: 'Air', value: 'Air', emoji: '💨' },
];

export const PLANETS_CATALOG: CatalogItem[] = [
  { id: 'Mercury', label: 'Mercury', value: 'Mercury' },
  { id: 'Venus', label: 'Venus', value: 'Venus' },
  { id: 'Earth', label: 'Earth', value: 'Earth' },
  { id: 'Mars', label: 'Mars', value: 'Mars' },
  { id: 'Jupiter', label: 'Jupiter', value: 'Jupiter' },
  { id: 'Saturn', label: 'Saturn', value: 'Saturn' },
  { id: 'Uranus', label: 'Uranus', value: 'Uranus' },
  { id: 'Neptune', label: 'Neptune', value: 'Neptune' },
  { id: 'Pluto', label: 'Pluto', value: 'Pluto' },
];

export const PI_CATALOG: CatalogItem[] = [
  { id: 'Pi-1', label: '3', value: 3 },
  { id: 'Pi-2', label: '1', value: 1 },
  { id: 'Pi-3', label: '4', value: 4 },
  { id: 'Pi-4', label: '1', value: 1 },
  { id: 'Pi-5', label: '5', value: 5 },
  { id: 'Pi-6', label: '9', value: 9 },
  { id: 'Pi-7', label: '2', value: 2 },
  { id: 'Pi-8', label: '6', value: 6 },
  { id: 'Pi-9', label: '5', value: 5 },
  { id: 'Pi-10', label: '3', value: 3 },
];

export const RUNES_CATALOG: CatalogItem[] = [
  { id: 'Fehu', label: 'Fehu', value: 'Fehu', emoji: 'ᚠ' },
  { id: 'Uruz', label: 'Uruz', value: 'Uruz', emoji: 'ᚢ' },
  { id: 'Thurisaz', label: 'Thurisaz', value: 'Thurisaz', emoji: 'ᚦ' },
  { id: 'Ansuz', label: 'Ansuz', value: 'Ansuz', emoji: 'ᚨ' },
  { id: 'Raidho', label: 'Raidho', value: 'Raidho', emoji: 'ᚱ' },
  { id: 'Kenaz', label: 'Kenaz', value: 'Kenaz', emoji: 'ᚲ' },
];

export const ICHING_CATALOG: CatalogItem[] = [
  { id: 'Qian', label: 'Qián (1)', value: 'Qian' },
  { id: 'Kun', label: 'Kūn (2)', value: 'Kun' },
  { id: 'Zhun', label: 'Zhūn (3)', value: 'Zhun' },
  { id: 'Meng', label: 'Méng (4)', value: 'Meng' },
  { id: 'Xu', label: 'Xū (5)', value: 'Xu' },
  { id: 'Song', label: 'Sòng (6)', value: 'Song' },
];

export const CONSTELLATIONS_CATALOG: CatalogItem[] = [
  { id: 'Orion', label: 'Orion', value: 'Orion' },
  { id: 'UrsaMajor', label: 'Ursa Major', value: 'Ursa Major' },
  { id: 'UrsaMinor', label: 'Ursa Minor', value: 'Ursa Minor' },
  { id: 'Cassiopeia', label: 'Cassiopeia', value: 'Cassiopeia' },
  { id: 'Lyra', label: 'Lyra', value: 'Lyra' },
  { id: 'Cygnus', label: 'Cygnus', value: 'Cygnus' },
];

export const CATALOGS_BY_TYPE = {
  Card: CARDS_CATALOG,
  ESP: ESP_CATALOG,
  Color: COLORS_CATALOG,
  Number: NUMBERS_CATALOG,
  Word: [] as CatalogItem[],
  Zodiac: ZODIAC_CATALOG,
  Birthstone: BIRTHSTONES_CATALOG,
  Element: ELEMENTS_CATALOG,
  Planet: PLANETS_CATALOG,
  Pi: PI_CATALOG,
  Rune: RUNES_CATALOG,
  IChing: ICHING_CATALOG,
  Constellation: CONSTELLATIONS_CATALOG,
  Note: [] as CatalogItem[],
} as const;
