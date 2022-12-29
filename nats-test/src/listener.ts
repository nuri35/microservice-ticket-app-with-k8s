import nats from "node-nats-streaming";
console.clear();
const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  // Simple Publisher (all publishes are async in the node version of the client)
  console.log("Listener connected to Nats");

  const subscription = stan.subscribe("ticket:created");

  subscription.on("message", (msg) => {
    console.log("Message received", msg);
  });
});
