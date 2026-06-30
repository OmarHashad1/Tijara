export enum PAYMENT_STATUS {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PAYMENT_PROVIDER {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}
