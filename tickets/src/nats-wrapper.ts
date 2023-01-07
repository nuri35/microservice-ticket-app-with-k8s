import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;
}

export const natsWrapper = new NatsWrapper();

// mongo db gibi bir baglantı ayarını nats'da yapıyoruz. ders 341 de kaldın
