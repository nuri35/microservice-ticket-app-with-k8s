import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@fbticketss/common";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest, // midlleweare olarak kullanıyoruz
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email in use");
      }
      // yazdıgımız kendi build fonksıyonumuuz kullanıyoruz.user model bkz.
      const user = User.build({ email, password });
      await user.save(); // userSchema.pre trıgger oluyor.

      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      ); // unlem ısaretıyle typescrpte dıyoruz endıselenme bunu kontrol edıyoruz zaten

      req.session = {
        jwt: userJwt,
      };

      res.status(201).send(user);
    } catch (err) {
      throw err; // istersem db hatası olsun ıstersen if'de yakaladıgımız hata olsun buraya gelir hata , sonra burda throw dersen otomatıkman eğer varsa tabi error handle mıddleweare'a atar  yoksa throw errorluk sekılde gosterır hatayı ıstersen next dıyebılrsın burda. nest js 'dede catch'e dusuyor ama clienta gitmeden once bir mıddleweare 'da düşüyor.aynı sekılde
    }
  }
);
// auth klasorumuz ıcın auth deployment k8s objemız var bunun ıcınde mongo db user collectıon'ımız olacak
export { router as signupRouter };
