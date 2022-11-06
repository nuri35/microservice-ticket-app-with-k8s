import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
    constructor(public errors: ValidationError[]){
        super();

        // bir class'ı extends ediyrız. bunu yapmak ıcın buraya bir kod satırı daha yazmamıs lazım
        Object.setPrototypeOf(this, RequestValidationError.prototype);

    }
}