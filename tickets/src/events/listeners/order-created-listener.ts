import { Listener, OrderCreatedEvent, Subject } from "@fbticketss/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

// bız bunu ındex js de new OrderCreatedListener(nats.client baglantısı).listen seklınde kullancaz bununda base class'ı var lıstener ve bızım OrderCreatedListener constructor aslında lıstener'ın constructor'ı ıcın gecerlı olmus oluyor ordada private client: stan seklınde ve private oldugu ıcın bunu bir alt class'da kullanamayız this.client seklınde yanı OrderCreatedListener burda. dolayısıyla base lıstener'da vs protected ataması yapacagız common modulunde kı alt class'da kullanabılelım.

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // orderId boş olabilir. eger sııparıs verıldıyse tıcket'dakı orderId alanını dolduruyoruz burda ozman orderıd boş olmayacaktır.
    ticket.set({ orderId: data.id });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client);

    msg.ack();
  }
}
