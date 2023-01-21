import { Message } from "node-nats-streaming";
import { Subject, Listener, TicketUpdatedEvent } from "@fbticketss/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data); // kendımız yazdık schemada

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price, version } = data;
    ticket.set({ title, price, version });
    await ticket.save(); // save ederkende ticketSchema.plugin(updateIfCurrentPlugin); sayesınde  data.version 2ydi ona eşitlıyor ilgili datanın versionnunu update etti save etti 1'den artık 2 oldu

    msg.ack();
  }
}
