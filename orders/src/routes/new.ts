import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@fbticketss/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 1 dk

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    try {
      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        throw new NotFoundError();
      }

      const isReserved = await ticket.isReserved(); // unutma bır sorgudan sonra aktardıgın degıskende bir fonksıyon kullancaksan kendı yazdıgını schemada statıcs degılde method olarak tanımla

      if (isReserved) {
        throw new BadRequestError("Ticket is already reserved");
      }

      const expiration = new Date();
      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      ); // set 15 dakıka

      const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expireAt: expiration,
        ticket,
      });

      await order.save();

      await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expireAt: order.expireAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
      }); // bu publısh channel uzerınden hem payment servıce lıstener olarak dınlıcek hemde tıcket servıce dınlıcek

      // publish an event saying that an order was created
      res.status(201).send(order);
    } catch (error) {
      throw error;
    }
  }
);

export { router as newOrderRouter };
