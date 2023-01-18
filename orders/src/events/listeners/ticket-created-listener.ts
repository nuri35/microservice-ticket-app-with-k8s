import { Message } from "node-nats-streaming";
import { Subject, Listener, TicketCreatedEvent } from "@fbticketss/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    }); // bunu kaydederken  id, kısmı altcızgılı degıl mongo bunu gorur ve altcızgı ıd özellıgınde rastgele bır _id de ataması yapar .dolayısıyla order modulunde ticket models'de  ticketSchema.statics.build kısmında   _id: attrs.id, ataması yapıyoruz _id artık bızım id'dekı deger olur sonra save yapınca zaten toJson olayı devreye gırer ve sadece _id silinir id seklınde kalır document objemız.
    await ticket.save();
    msg.ack();
  }
}
