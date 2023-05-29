import { Subject } from "./subjects";

export interface SmsCreatedEvent {
  subject: Subject.SmsCreated;
  data: {
    email: string;
    phone: string;
    cityOfResidence: string;
    password: string;
  };
}
