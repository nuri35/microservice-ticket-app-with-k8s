import express from "express";
import { json } from "body-parser";
require("express-async-errors");
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@fbticketss/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUser); // mıddleweare ! payload yapmamızı saglar token'ının  jwt verify yaparak burda kullanmak mantıklı  app.use  cookieSession'dan sonra daha sonra router'ların orda require-auth mıddlewearını kullanrıız. fakat auth servıs ıcersınde currentUser routerında require-auth mıddlewearını kullanmayalım. hata dondurur null durumunda 401 dıye tıcketing.dev anasayfasında dondurmesını ıstemıyoruz. onun ıcın ordada currentuser mıddlewear var jwt verfıy var payload atayan currentuser'a onu index.ts 'De  kullandık. burdakı gıbı
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  //
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connect success to database");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
