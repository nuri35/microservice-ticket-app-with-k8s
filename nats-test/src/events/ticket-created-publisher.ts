import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-creted-event";
import { Subject } from "./subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
