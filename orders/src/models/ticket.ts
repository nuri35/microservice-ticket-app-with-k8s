import mongoose from "mongoose";
import { OrderStatus } from "@fbticketss/common";
import { Order } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");

// burdan versıonlama olayını kaldırdık bir arttırıyordu bunu yanı updateIfCurrentPlugin. onun yerıne zaten tıcket created lıstener'da default versıon 0 olacak. update lıstener'da ıse tıcket'an gelen versıon datasını kaydedıoruz. burda yenıden plugın kullanmıyoruz. update veya tıcker lıstenerdada en son save trıgger oldugunda bu fonksıyon calısacaktır. burdada plugın kullansak belkı farklı verıtabanıdır farklı versıonlama yapabılır onun ıcın böyle tıckets publisher'ına  baglı kalarak ordan gelen datayı update listener'ında kullanıyoruz.
ticketSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - 1,
  };
  done();
});

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  }); // version her kaydetgımızde artıyor yada update ettıgımzıde order'da ticket schemasında version 1 okey . update edecek olan datanın versionun bir eksisi  listenerdakı ticket versionnu ile eşleşiyorsa sırada demek o varmış diye ekleyecek update işlemını
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ], // eğer order tablosunda document objelerınde bu enum'lar var ise gelen istektebirdaha rezerve edemez dıyoruz
    },
  });
  return !!existingOrder; // ya donen datayı verıcektır yada null dondurcektır
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
