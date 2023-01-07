import { Listener } from "./base-listener";
import nats, { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payment-service";

  onMessage(data: any, msg: Message) {
    console.log("Event data!", data);
    msg.ack();
  }
}
