import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // not : db-connectıon yada request-validation-errors'a baktıgımızda abstract extends ettık yanı onun ozerllıklerını kullanabılrız tabı class dolayısıyla tıp atamasıda olmuş oldu onu cagırdıgımızda abstract'dakıleri karsılaması lazım 2 error tip'de CustomError abstract turunde  1 tane error tipını kullnarak throw ettık ve sımdı buraya duştu mıddleweare'a yanı burdada sadece (err instanceof CustomError) seklınde kontrol yapmamız yeterlı. hangısıysede onun serıalizeError'unu kullancak.
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  //genel olarak aynı tıpte butun hatalar ıncelendıgınde errors[{message:bla bla}] seklınde
  res.status(400).send({
    errors: [{ message: "Something went wrong" }], // eğer bızım tanıladıgımız hatalar degılse ıf kısmına gırmıcek en son burayı verır.
  });
};
