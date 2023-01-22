import { Listener, OrderCreatedEvent, Subject } from "@fbticketss/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues-bulkJS/expiration-queue";
//hangı order'ı expire edecegıme daır bılmem gerektıgı ıcın burda order created lıstenerımız olması lazım

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //listenera gelen datayı bull js'dekı queue'ya atacagız
    await expirationQueue.add({
      orderId: data.id, // orderId yerıne orderIdxx dedıgınde bız  new Queue<Payload> yaptıgımız ıcın payload'dıda queue objesıının ıcınde add fonksıyonunda parametre olarak atama yaptıgı ıcın tip olarak onu kullanıyor kızıyor yanı
    });
    msg.ack();
  }
}
