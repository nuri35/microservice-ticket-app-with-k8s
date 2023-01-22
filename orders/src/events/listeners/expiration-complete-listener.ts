import { Message } from "node-nats-streaming";
import {
  Subject,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@fbticketss/common";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

//boyle bır lıstener olmalıkı order'da expire oldugunda verılen sure kadar daha sorna burda order'ın statusunu cancelled yapıcaz daha sonra  order:cancelled dıye publish edecegız
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({
      status: OrderStatus.Cancelled,
      ticket: null, // cancel oldugu ıcın tıcket'da null yanı tıcket alanı yok order'da demek
    });
    msg.ack();
  }
}
