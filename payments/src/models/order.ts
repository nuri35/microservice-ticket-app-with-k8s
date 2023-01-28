import { OrderStatus } from "@fbticketss/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
// unutma bu models'dekıler schema yanı tablo gıbı dusunebılrısn asıl bız payment başkarken payment dıye bir database oluşturuluyor bu module özel onun ıcınde bu moedls'dekı schemalar yanı tablolar
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
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
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin); // orders modulundekı models klasorundekı tickets'De  updateIfCurrentPlugin kullanmadık farklılık olması amacıyla burda kullanalım. orda dada şu case'ı dusunup ornek amacıyla oyle yapmıstık ticket update listener'da ticket'i dinliyor orda ticket modulunde update ettıgınde ordakı model'de versıonlama degısık olabılır sonra order'da ticket update lıstener'a gelıncede orda da plugın kullanıyoruz dıyelım versıonlama 100 1001 dıye gıdebılır bır tutarlılık olmayabılır. böyle bir case.......

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
