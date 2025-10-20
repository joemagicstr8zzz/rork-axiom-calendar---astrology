export type StackType = 'mnemonica' | 'aronson' | 'custom';

export interface StackCard {
  position: number;
  label: string;
  value: string;
  suit: string;
}

export const MNEMONICA_STACK: StackCard[] = [
  { position: 1, label: '4C', value: '4', suit: 'C' },
  { position: 2, label: '2H', value: '2', suit: 'H' },
  { position: 3, label: '7D', value: '7', suit: 'D' },
  { position: 4, label: '3C', value: '3', suit: 'C' },
  { position: 5, label: '4H', value: '4', suit: 'H' },
  { position: 6, label: '6D', value: '6', suit: 'D' },
  { position: 7, label: 'AS', value: 'A', suit: 'S' },
  { position: 8, label: '5H', value: '5', suit: 'H' },
  { position: 9, label: '9S', value: '9', suit: 'S' },
  { position: 10, label: '2S', value: '2', suit: 'S' },
  { position: 11, label: 'QH', value: 'Q', suit: 'H' },
  { position: 12, label: '3D', value: '3', suit: 'D' },
  { position: 13, label: 'QC', value: 'Q', suit: 'C' },
  { position: 14, label: '8H', value: '8', suit: 'H' },
  { position: 15, label: '6S', value: '6', suit: 'S' },
  { position: 16, label: '5S', value: '5', suit: 'S' },
  { position: 17, label: '9H', value: '9', suit: 'H' },
  { position: 18, label: 'KC', value: 'K', suit: 'C' },
  { position: 19, label: '2D', value: '2', suit: 'D' },
  { position: 20, label: 'JH', value: 'J', suit: 'H' },
  { position: 21, label: '3S', value: '3', suit: 'S' },
  { position: 22, label: '8S', value: '8', suit: 'S' },
  { position: 23, label: '6H', value: '6', suit: 'H' },
  { position: 24, label: '10C', value: '10', suit: 'C' },
  { position: 25, label: '5D', value: '5', suit: 'D' },
  { position: 26, label: 'KD', value: 'K', suit: 'D' },
  { position: 27, label: '2C', value: '2', suit: 'C' },
  { position: 28, label: '3H', value: '3', suit: 'H' },
  { position: 29, label: '8D', value: '8', suit: 'D' },
  { position: 30, label: '5C', value: '5', suit: 'C' },
  { position: 31, label: 'KS', value: 'K', suit: 'S' },
  { position: 32, label: 'JD', value: 'J', suit: 'D' },
  { position: 33, label: '8C', value: '8', suit: 'C' },
  { position: 34, label: '10S', value: '10', suit: 'S' },
  { position: 35, label: 'KH', value: 'K', suit: 'H' },
  { position: 36, label: 'JC', value: 'J', suit: 'C' },
  { position: 37, label: '7S', value: '7', suit: 'S' },
  { position: 38, label: '10H', value: '10', suit: 'H' },
  { position: 39, label: 'AD', value: 'A', suit: 'D' },
  { position: 40, label: '4S', value: '4', suit: 'S' },
  { position: 41, label: '7H', value: '7', suit: 'H' },
  { position: 42, label: '4D', value: '4', suit: 'D' },
  { position: 43, label: 'AC', value: 'A', suit: 'C' },
  { position: 44, label: '9C', value: '9', suit: 'C' },
  { position: 45, label: 'JS', value: 'J', suit: 'S' },
  { position: 46, label: 'QD', value: 'Q', suit: 'D' },
  { position: 47, label: '10D', value: '10', suit: 'D' },
  { position: 48, label: '6C', value: '6', suit: 'C' },
  { position: 49, label: 'AH', value: 'A', suit: 'H' },
  { position: 50, label: '9D', value: '9', suit: 'D' },
  { position: 51, label: 'QS', value: 'Q', suit: 'S' },
  { position: 52, label: '7C', value: '7', suit: 'C' },
];

export const ARONSON_STACK: StackCard[] = [
  { position: 1, label: 'JS', value: 'J', suit: 'S' },
  { position: 2, label: 'KD', value: 'K', suit: 'D' },
  { position: 3, label: '3C', value: '3', suit: 'C' },
  { position: 4, label: '2H', value: '2', suit: 'H' },
  { position: 5, label: '3S', value: '3', suit: 'S' },
  { position: 6, label: '5H', value: '5', suit: 'H' },
  { position: 7, label: '6D', value: '6', suit: 'D' },
  { position: 8, label: 'AS', value: 'A', suit: 'S' },
  { position: 9, label: '4H', value: '4', suit: 'H' },
  { position: 10, label: 'AC', value: 'A', suit: 'C' },
  { position: 11, label: '4C', value: '4', suit: 'C' },
  { position: 12, label: '2S', value: '2', suit: 'S' },
  { position: 13, label: 'KC', value: 'K', suit: 'C' },
  { position: 14, label: '10H', value: '10', suit: 'H' },
  { position: 15, label: '5D', value: '5', suit: 'D' },
  { position: 16, label: '8S', value: '8', suit: 'S' },
  { position: 17, label: '7D', value: '7', suit: 'D' },
  { position: 18, label: '2C', value: '2', suit: 'C' },
  { position: 19, label: '3H', value: '3', suit: 'H' },
  { position: 20, label: '6C', value: '6', suit: 'C' },
  { position: 21, label: '9D', value: '9', suit: 'D' },
  { position: 22, label: 'QS', value: 'Q', suit: 'S' },
  { position: 23, label: 'AH', value: 'A', suit: 'H' },
  { position: 24, label: '7C', value: '7', suit: 'C' },
  { position: 25, label: 'KH', value: 'K', suit: 'H' },
  { position: 26, label: '5S', value: '5', suit: 'S' },
  { position: 27, label: '10D', value: '10', suit: 'D' },
  { position: 28, label: 'JH', value: 'J', suit: 'H' },
  { position: 29, label: 'QD', value: 'Q', suit: 'D' },
  { position: 30, label: '8C', value: '8', suit: 'C' },
  { position: 31, label: '9S', value: '9', suit: 'S' },
  { position: 32, label: '6S', value: '6', suit: 'S' },
  { position: 33, label: 'KS', value: 'K', suit: 'S' },
  { position: 34, label: '2D', value: '2', suit: 'D' },
  { position: 35, label: '4D', value: '4', suit: 'D' },
  { position: 36, label: '5C', value: '5', suit: 'C' },
  { position: 37, label: 'QH', value: 'Q', suit: 'H' },
  { position: 38, label: '3D', value: '3', suit: 'D' },
  { position: 39, label: 'JC', value: 'J', suit: 'C' },
  { position: 40, label: '10C', value: '10', suit: 'C' },
  { position: 41, label: 'JD', value: 'J', suit: 'D' },
  { position: 42, label: 'QC', value: 'Q', suit: 'C' },
  { position: 43, label: '7H', value: '7', suit: 'H' },
  { position: 44, label: '7S', value: '7', suit: 'S' },
  { position: 45, label: '6H', value: '6', suit: 'H' },
  { position: 46, label: 'AD', value: 'A', suit: 'D' },
  { position: 47, label: '8D', value: '8', suit: 'D' },
  { position: 48, label: '10S', value: '10', suit: 'S' },
  { position: 49, label: '9H', value: '9', suit: 'H' },
  { position: 50, label: '4S', value: '4', suit: 'S' },
  { position: 51, label: '9C', value: '9', suit: 'C' },
  { position: 52, label: '8H', value: '8', suit: 'H' },
];

export const getStackByType = (type: StackType): StackCard[] => {
  switch (type) {
    case 'mnemonica':
      return MNEMONICA_STACK;
    case 'aronson':
      return ARONSON_STACK;
    case 'custom':
      return [];
    default:
      return MNEMONICA_STACK;
  }
};
