import { CustomError } from "./custom-error";

// CustomError bir abstract oldugu ıcın extends seklınde yazıyoruz class'a  eğer o abstract class'dakı birşeyı burda uygulamazsan ts hata verecektır. bir tür tip ataması
export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to database";
  constructor() {
    super('Error connecting to db');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
