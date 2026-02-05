
export interface User {
  id: string;
  name: string;
  phone: string;
  balance: number;
  totalInvestment: number;
  totalEarnings: number;
  referralCode: string;
  referrals: number;
  isAdmin: boolean;
  activeInvestments: Investment[];
}

export interface Investment {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  dailyReturn: number;
  purchaseDate: number;
  expiryDate: number;
  lastCollectionDate: number; 
}

export interface Product {
  id: string;
  name: string;
  price: number;
  dailyIncome: number;
  validityDays: number;
  image: string;
  category: 'Starter' | 'Pro' | 'Enterprise';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'recharge' | 'withdraw' | 'bonus' | 'investment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  details?: string;
  upiId?: string; 
  utr?: string;   
}

export interface GiftCode {
  code: string;
  rewardAmount: number;
  maxUses: number;
  currentUses: number;
  expiryDate: number;
}

export interface AppSettings {
  appName: string;
  appLogo: string;
  aboutContent: string;
  platformUpi: string;
  minRecharge: number;
  minWithdrawal: number;
  allowWithdrawals: boolean;
}
