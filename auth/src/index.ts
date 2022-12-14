import express from "express";
import { json } from "body-parser";
require("express-async-errors");
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError, currentUser } from "@fbticketss/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUser);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// patch post vs ıstekler ııcınde not found error yapımız gecerlı olacaktır
// app.all('*',()=>{
//   throw new NotFoundError()
// })
// buda geçerli all gibi patch post ısteklerı ıcınde not found error tıpımız gecerlı olacaktır.
// app.use((req, res, next) => {
//   throw new NotFoundError()
// }); bunlar çalışır fakat async fonksıyonlu ypacaksak şu skeılde

// app.all('*',async(req,res,next)=>{
// next(new NotFoundError())
// }) bu async'li kullanıp throw seklınde kullanmak ıstedıgımızde next anahtar fonskıyonunu kullanmak ıstemessek tabı farklı yapmamız gerekecetır. tabıkıde express async-error dıye bır kutuphaneyı kullancagız bu paket sayesınde async fonkyıonlarda throw kullanbılrız

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
