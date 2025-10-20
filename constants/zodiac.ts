export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dateRange: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  traits: string;
  reading: string;
  focusWord: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'Fire',
    dateRange: 'Mar 21 - Apr 19',
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    traits: 'Bold and ambitious, you lead with courage and determination. Your direct approach inspires others.',
    reading: 'Today calls for decisive action. Trust your instincts and move forward with confidence.',
    focusWord: 'Initiative',
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    dateRange: 'Apr 20 - May 20',
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    traits: 'Grounded and patient, you value stability and beauty. Your persistence builds lasting foundations.',
    reading: 'Steady progress brings rewards. Focus on what brings you comfort and security.',
    focusWord: 'Stability',
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'Air',
    dateRange: 'May 21 - Jun 20',
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    traits: 'Curious and expressive, you thrive on connection and variety. Your adaptability opens doors.',
    reading: 'Communication flows easily now. Share your ideas and embrace new perspectives.',
    focusWord: 'Curiosity',
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'Water',
    dateRange: 'Jun 21 - Jul 22',
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    traits: 'Intuitive and nurturing, you create safe spaces for yourself and others. Your empathy heals.',
    reading: 'Listen to your emotions today. Home and heart matter most right now.',
    focusWord: 'Nurture',
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'Fire',
    dateRange: 'Jul 23 - Aug 22',
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    traits: 'Confident and generous, you shine brightly and inspire those around you. Your warmth is magnetic.',
    reading: 'Step into the spotlight. Your natural leadership brings positive change.',
    focusWord: 'Radiance',
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    dateRange: 'Aug 23 - Sep 22',
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    traits: 'Analytical and thoughtful, you refine what you touch. Your attention to detail creates excellence.',
    reading: 'Organization brings clarity. Small improvements lead to meaningful results.',
    focusWord: 'Precision',
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'Air',
    dateRange: 'Sep 23 - Oct 22',
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    traits: 'Diplomatic and graceful, you seek harmony and fairness. Your balance brings peace to others.',
    reading: 'Seek equilibrium in all things. Partnerships flourish under your guidance.',
    focusWord: 'Balance',
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    dateRange: 'Oct 23 - Nov 21',
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    traits: 'Intense and transformative, you dive deep and emerge renewed. Your passion moves mountains.',
    reading: 'Embrace transformation. Hidden truths reveal themselves when you look within.',
    focusWord: 'Depth',
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    dateRange: 'Nov 22 - Dec 21',
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    traits: 'Adventurous and philosophical, you seek truth and expansion. Your optimism lights the way.',
    reading: 'Explore new horizons. Your quest for meaning leads to discovery.',
    focusWord: 'Freedom',
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    dateRange: 'Dec 22 - Jan 19',
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    traits: 'Ambitious and disciplined, you build with intention and patience. Your persistence achieves goals.',
    reading: 'Long-term planning pays off. Stay focused on your highest aspirations.',
    focusWord: 'Mastery',
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    dateRange: 'Jan 20 - Feb 18',
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    traits: 'Innovative and independent, you envision the future. Your unique perspective inspires change.',
    reading: 'Think differently. Your originality brings breakthroughs and connections.',
    focusWord: 'Innovation',
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'Water',
    dateRange: 'Feb 19 - Mar 20',
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    traits: 'Compassionate and intuitive, you feel deeply and dream vividly. Your sensitivity is a gift.',
    reading: 'Trust your imagination. Creative expression brings healing and insight.',
    focusWord: 'Intuition',
  },
];

export const getZodiacSign = (month: number, day: number): ZodiacSign => {
  for (const sign of ZODIAC_SIGNS) {
    if (month === sign.startMonth && day >= sign.startDay) {
      return sign;
    }
    if (month === sign.endMonth && day <= sign.endDay) {
      return sign;
    }
    if (sign.startMonth > sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay) {
        return sign;
      }
      if (month === sign.endMonth && day <= sign.endDay) {
        return sign;
      }
    }
  }
  return ZODIAC_SIGNS[0];
};
