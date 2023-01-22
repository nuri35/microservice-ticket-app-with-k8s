import { Listener, OrderCreatedEvent, Subject } from "@fbticketss/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues-bulkJS/expiration-queue";
//hangı order'ı expire edecegıme daır bılmem gerektıgı ıcın burda order created lıstenerımız olması lazım

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expireAt).getTime() - new Date().getTime();
    //listenera gelen datayı bull js'dekı queue'ya atacagız
    console.log("Waiting this many milliseconds to process the job", delay);
    await expirationQueue.add(
      {
        orderId: data.id, // orderId yerıne orderIdxx dedıgınde bız  new Queue<Payload> yaptıgımız ıcın payload'dıda queue objesıının ıcınde add fonksıyonunda parametre olarak atama yaptıgı ıcın tip olarak onu kullanıyor kızıyor yanı
      },
      {
        delay, // bu zaman dılımınden sonra kuyruga eklıcek ordan process'e ıletcek artık o anda process'de ne yapıyorsan
      }
    );
    // burdanda process'e gıdıp orda amacına göre ıslem yapıyorsun bızım amacımızda publısh ederek event yaymak ama ondan once burayı 15dkakıa gecıktırecgız. mesela bır dosya dowloand etme amacımız olsaydı o logic'i procecs kısmında yapacaktık.burdada amacımız bu kuyruk uzerınden process'de publısh etmek bır olay yaymak onun ıcın sadece publsh kullancaz process kısmında ama bu işlemı 15dk sonra felan yapsın bunu process'de yazmaya gerek yok burda yaparak 15 dk sonra bull kuyrugundan geçerek process'E eklesın. bu delay ıslemıde destekleyen şey bullJS

    msg.ack();
  }
}
