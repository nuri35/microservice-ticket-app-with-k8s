import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@fbticketss/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    const charge = await stripe.charges.create({
      // This is the line that is causing the error below
      currency: "usd",
      amount: order.price * 100,
      source: token, // This is the token that we get from the client side  (Stripe.js) when the user submits the form with the credit card information (see the Stripe.js documentation) yani kredi kart bilgileri token oluyor. sımule etmıs oluyoruz normalde bu tokenı alıyoruz taraycımızın ıcınde calısan strıpe kutuphanesınden kısı form'da kredı bılgılerı gırınce token olusuyor. orderıd ve o tokenı bıze yollamış oluyor bızde onu sunuyoruz   stripe.charges.create fonskıyonun ıcınde
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    // bir olayu yayacagız orderstatus payment dıcez ve expiratıon modulu  o ankı payment statuse gecen order'ı cancelled yapmıcak.  yanı order modulunde lıstener var expiration-complete dıye orda ıf ıle kontrol yapcak 1 dakıka sonra olay burya yayılcak ve burda eğer oncesınde status odendı olanları ıf kontrolu yaparak cancelled'a cekmıcek.
    res.send({ success: true, id: payment.id });
  }
);

export { router as createChargeRouter };
