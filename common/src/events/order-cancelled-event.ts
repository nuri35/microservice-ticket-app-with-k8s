import { Subject } from "./subjects";

export interface OrderCancelledEvent {
  subject: Subject.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
