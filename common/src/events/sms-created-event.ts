import { Subject } from "./subjects";

export interface SmsCreatedEvent {
  subject: Subject.SmsCreated;
  data: {
    phone: string;
    password: string;
  };
}
