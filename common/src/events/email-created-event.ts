import { Subject } from './subjects';

export interface EmailCreatedEvent {
  subject: Subject.EmailCreated;
  data: {
    email: string;
    template: string;
  };
}
