export interface SelectViewProps<T> {
  onBack: () => void;
  onSelect: (item: T) => void;
  list?: T[];
}

export enum PortfolioWidgetVariants {
  Swap = 'swap',
  Buy = 'buy',
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  Claim = 'claim', // will be implemented later
  Compound = 'compound', // will be implemented later
  Switch = 'switch', // will be implemented later
  Repay = 'repay', // will be implemented later
  Borrow = 'borrow',
}
