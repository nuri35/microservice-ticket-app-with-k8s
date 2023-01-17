import { Publisher, Subject, OrderCancelledEvent } from "@fbticketss/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}
