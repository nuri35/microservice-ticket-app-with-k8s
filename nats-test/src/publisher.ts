import nats from "node-nats-streaming";
console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  // Simple Publisher (all publishes are async in the node version of the client)
  console.log("Publisher connected to Nats");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    console.log("event published data");
  });
});
