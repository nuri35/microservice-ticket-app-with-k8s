import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  // Simple Publisher (all publishes are async in the node version of the client)
  console.log("Listener connected to Nats");

  stan.on("close", () => {
    console.log("Nats conection closed");
    process.exit();
  });

  const option = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");

  const subscription = stan.subscribe(
    "ticket:created",
    "queue-group-name",
    // "orders-service-queue-group",
    option
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log("Message received", msg.getSequence(), JSON.parse(data));
    }
    msg.ack(); //bunu yazarak node nats akış kutuphanesıne söyleyecektir tekrardan gats streamıng server'ına ulaşmasını. hey mesajı aldık işlendı demesını söyler yanı.
  });
});

// bunlar kesme sınyallerını ızler

process.on("SIGINT", () => stan.close()); // may not working on windows
process.on("SIGTERM", () => stan.close());
// DOSYA ıcerısınde ctrl s yaptıgımızda yenıden baslıyor lıstener yada termınalden rs dıyebılıyorsan yenıden baslatacaktır lıstener'ı yada  node dev programımızı yenıden baslatmaya calsıtıında işte aynı şeyleri dıyorum aslında  gelen kesme ve solandırma ısteklerını engelleyecegız ondan once stan connectıon'ınını kapatacagız. stan cloose'u fonskıyonunu cagırarak  client ulaşacak node nats kutuphanesı server'ına  ve dıcek dont send me any more messages
