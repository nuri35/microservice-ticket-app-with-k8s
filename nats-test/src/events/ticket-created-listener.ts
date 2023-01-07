import { Listener } from "./base-listener";
import nats, { Message } from "node-nats-streaming";
import { Subject } from "./subjects";
import { TicketCreatedEvent } from "./ticket-creted-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = "payment-service";

  onMessage(data: any, msg: Message) {
    console.log("Event data!", data);
    msg.ack();
  }
}
