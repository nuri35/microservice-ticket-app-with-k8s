import { Listener, OrderCreatedEvent, Subject } from "@fbticketss/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

//hangı order'ı expire edecegıme daır bılmem gerektıgı ıcın burda order created lıstenerımız olması lazım

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    msg.ack();
  }
}
