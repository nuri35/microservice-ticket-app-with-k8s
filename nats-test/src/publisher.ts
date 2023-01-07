import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  // Simple Publisher (all publishes are async in the node version of the client)
  console.log("Publisher connected to Nats");

  const data = {
    id: "123",
    title: "concert",
    price: 20,
  };

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish(data);
  } catch (error) {
    console.log(error);
  }
});
