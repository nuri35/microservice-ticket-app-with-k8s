import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // özel hata sınıflarını tanıyabilir miyiz?
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  //genel olarak aynı tıpte butun hatalar ıncelendıgınde errors[{message:bla bla}] seklınde
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }], // eğer bızım tanıladıgımız hatalar degılse ıf kısmına gırmıcek en son burayı verır.
  });
};
