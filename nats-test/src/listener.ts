import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to Nats");

  stan.on("close", () => {
    console.log("Nats conection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close()); // may not working on windows
process.on("SIGTERM", () => stan.close());
// DOSYA ıcerısınde ctrl s yaptıgımızda yenıden baslıyor lıstener yada termınalden rs dıyebılıyorsan yenıden baslatacaktır lıstener'ı yada  node dev programımızı yenıden baslatmaya calsıtıında işte aynı şeyleri dıyorum aslında  gelen kesme ve solandırma ısteklerını engelleyecegız ondan once stan connectıon'ınını kapatacagız. stan cloose'u fonskıyonunu cagırarak  client ulaşacak node nats kutuphanesı server'ına  ve dıcek dont send me any more messages
