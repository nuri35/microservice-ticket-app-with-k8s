import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload // soru işareti koyduk belkı kullanıcı oturum açmamıştır. bu bızım ekledıgımzı yenı ozellık.
        }
    }
} // bu sekılde request'de bır şeye tip ataması yapılabılır. bak request extends demedıgımzıe dıkkat edelım. mevcut bır arayuzu degıstırmek veya ona yenı ozelıkler eklemek ıstersek, aynı interface'i aynı namespace'i yazarız yukardakı gıbı işte daha sonra interface request ıcınde işte arttırmak ıstedıgımzı ozellıklerı eklerız

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
   req.currentUser = payload
  } catch (err) {
    
  }
  next();
};
