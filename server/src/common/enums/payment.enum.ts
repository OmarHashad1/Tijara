export enum PAYMENT_STATUS {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum PAYMENT_PROVIDER {
  STRIPE = 'stripe',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}
