import { Subject } from "./subjects";

export interface TicketCreatedEvent {
  subject: Subject.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

export interface OrderUpdatedEvent {
  subject: Subject.OrderUpdated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
