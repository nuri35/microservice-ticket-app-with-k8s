import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publisher/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";
interface Payload {
  orderId: string;
}

// typescrıpte yenı bır ıs olusturmak ve bır ısı ıslemek ıcın kod yazmaya basladıgımızda  kuyrugumuzdan ne tur verılerı aktaracagımızı anlaması ıcın  new Queue<Payload> yazdık kuyruktan sonra redıse ekledıkten sonra  bır ısı gercekten ısleyecegımız yer code to proces a job olacak burası redıse ekledıkten sonra ve bıze gerı gonderdıgı ve bızım de onu bır sekılde bır amaca yonelık ıslemeye basladıgımız yerdır.
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
