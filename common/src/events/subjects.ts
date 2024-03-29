export enum Subject { // which channel
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  SmsCreated = 'sms:created',

  EmailCreated = 'email:created',

  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',

  ExpirationComplete = 'expiration:complete',
  PaymentCreated = 'payment:created',
}
