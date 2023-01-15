import { Publisher, Subject, TicketUpdatedEvent } from "@fbticketss/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
}
