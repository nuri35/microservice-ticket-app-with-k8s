import {
  Listener,
  Subject,
  OrderCancelledEvent,
  OrderStatus,
} from "@fbticketss/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1, // eğer guncelleme olayı varsa işin icnde ozaman verssıon olayı onem kazanır aslıdna burda onemsız.
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
// bu payment'da neden order cancelled listener  ıle ılgılı bır lıstener'ımız var cunku bunu payments modulundekı order tablosuna kaydedecegız ve böylelıkle  bır odeme yaparken onceden belkı cancelled duruma gecırılmıştır o an odeme yaparken bu cancelled olup olmadıgı bılgısını ıste bu modul ıcerısındekı order moedl'ınden alabılırız.
