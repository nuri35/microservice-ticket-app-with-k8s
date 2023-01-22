import {
  Subject,
  Publisher,
  ExpirationCompleteEvent,
} from "@fbticketss/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}
