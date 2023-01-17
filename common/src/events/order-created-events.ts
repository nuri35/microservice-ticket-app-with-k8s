import { Subject } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
  subject: Subject.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: String;
    expireAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}