import express from "express";
import { json } from "body-parser";
require('express-async-errors');
import mongoose from 'mongoose'
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

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

app.all('*',async(req,res)=>{ // 
  throw new NotFoundError()
})

app.use(errorHandler);


const start = async ()=>{
 try{
  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
  console.log("connect success to database")
 }catch(err){
  console.log(err)
 }

 
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
}

start();


