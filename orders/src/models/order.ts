import mongoose from "mongoose";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expireAt: Date;
  ticket: TicketDoc; // ref yaptıgımızda ticket bılgılerını verecektır onun ıcın bır tıp ataması
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expireAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket", // ticket create edıldıgınde event bus olarak olay yayılcak lıtener olan order'a burda tıcket documen'a kaydedılcek order sıparıs edıldıgınde burayı boyle yaptıgımız ıcın ılıskılendırılmış olcak
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
  }
);
// birşey kaydetmek ıcın schema da bulunan fonksıyonlara 1 tane ben eklıyorum bır fonksıyon
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
// export ettgımız bu Order'ı Order.build dedıgımızde   orderSchema.statics.build dakı calısacak cunku   mongoose.model<OrderDoc, OrderModel> yaptık. OrderModel extends seklınde bırşey yazdık bızım yazdgımız build'dede ulaşabırız artık nasıl ulaşabıldık cunku   mongoose.model<OrderDoc, OrderModel> bunu yazdgımız ıcın  ayrıca yazdıımgız fonksıyon cagırdıgımzıda OrderModel dekı tanımladıgımız fonksıyonu calsır oda bıze zaten orderDoc dondurur. yanı nokta dııyp yenı bırşey ekletmez.
