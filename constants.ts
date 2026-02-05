
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Eco-Mini Power 1.0',
    price: 500,
    dailyIncome: 25,
    validityDays: 30,
    image: 'https://picsum.photos/seed/power1/400/400',
    category: 'Starter'
  },
  {
    id: 'p2',
    name: 'Volt-Core Prime',
    price: 2000,
    dailyIncome: 110,
    validityDays: 45,
    image: 'https://picsum.photos/seed/power2/400/400',
    category: 'Pro'
  },
  {
    id: 'p3',
    name: 'Grid-Master 5000',
    price: 5000,
    dailyIncome: 300,
    validityDays: 60,
    image: 'https://picsum.photos/seed/power3/400/400',
    category: 'Enterprise'
  },
  {
    id: 'p4',
    name: 'Quantum Battery Hub',
    price: 15000,
    dailyIncome: 1000,
    validityDays: 90,
    image: 'https://picsum.photos/seed/power4/400/400',
    category: 'Enterprise'
  }
];

export const MIN_WITHDRAWAL = 100;
export const MIN_RECHARGE = 500;
