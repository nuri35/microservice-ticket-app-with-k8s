import { Message } from "node-nats-streaming";
import {
  Subject,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@fbticketss/common";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

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
    }); // cancelled'a daır publısh event yayacagız
    await order.save();
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    }); // bu publısh ettıgımızde event yayıyoruz. listener olarak tıcket dınlıyor.  cunku başkası tıcket'ı satın alabılır bılgı verıyoruz artık bu cancelled durumda baska alabılır yanı
    msg.ack();
  }
}
