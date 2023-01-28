import { Subject, Publisher, PaymentCreatedEvent } from "@fbticketss/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subject.PaymentCreated = Subject.PaymentCreated;
}
