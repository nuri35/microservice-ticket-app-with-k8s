import nats, { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  protected ackWait = 5 * 1000; // private gibi dışardan ulaşamayız ister bu abstract yerıne normal class olsun bu class'ı new dıye cagır sonra ulaş istersen bu abstract yada class olsun subsclass'a extend ettıkten sonra subclass'ı cagırarak dışardan ulaş ulaşamazsın prıvate gibi . fakat private'den farklı olarak bu subclass içerisinde kullanablrsın fakat private yaptıgında sadece ana class'ın ıcerısnıde kullanabılrsın.

  constructor(private client: Stan) {
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
