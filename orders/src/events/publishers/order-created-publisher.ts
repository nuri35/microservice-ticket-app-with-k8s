import { Publisher, Subject, OrderCreatedEvent } from "@fbticketss/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
