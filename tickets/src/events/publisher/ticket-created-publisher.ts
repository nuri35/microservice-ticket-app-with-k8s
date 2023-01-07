import { Publisher, Subject, TicketCreatedEvent } from "@fbticketss/common"; 

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
