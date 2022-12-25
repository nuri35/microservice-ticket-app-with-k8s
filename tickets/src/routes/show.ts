import express, { Request, Response } from "express";
import { NotFoundError } from "@fbticketss/common";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  } catch (err) {
    throw err;
  }
});

router.get("/api/tickets", async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.find({});

    res.send(ticket);
  } catch (err) {
    throw err;
  }
});

export { router as showTicketRouter };
