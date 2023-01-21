import nats, { Message, Stan } from "node-nats-streaming";
import { Subject } from "./subjects";

interface Event {
  subject: Subject;
  data: any;
}
// classa interface tıp ataması ıcın ımpleement yapabılıyorduk fakat oyle birşey yapmıcaz biz T'ye kalıtmak veya tıp ataması yapmak ıstıyorz kalıttıgın zamanda otomatıkman kalıttıgın ana kaynak neyse onun tıplemesıne bagımlısın zaten vayrıca t.subject seklındede dıyebılrsın yada T['subject] skelınde  cunku kalıttk sankı T dıye bır ınterface oluturmusuz gıbı ama olusturmadk aslında Event ınterce'ındekı key'leri kullandık
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected ackWait = 5 * 1000; // private gibi dışardan ulaşamayız ister bu abstract yerıne normal class olsun bu class'ı new dıye cagır sonra ulaş istersen bu abstract yada class olsun subsclass'a extend ettıkten sonra subclass'ı cagırarak dışardan ulaş ulaşamazsın prıvate gibi . fakat private'den farklı olarak bu subclass içerisinde kullanablrsın fakat private yaptıgında sadece ana class'ın ıcerısnıde kullanabılrsın.

  constructor(protected client: Stan) {
    this.client = client;
  }

  subscriptionOption() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOption()
    );
    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName} `
      );
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
