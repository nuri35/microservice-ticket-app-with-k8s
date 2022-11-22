import {scrypt,randomBytes } from 'crypto'
import {promisify} from "util"

const scryptAsync = promisify(scrypt)

export class Password {
    static async toHash(password: string){
        const salt = randomBytes(8).toString('hex')
        const buf = (await scryptAsync(password,salt,64)) as Buffer
        return `${buf.toString('hex')}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string){
        const [hashedPassword, salt] = storedPassword.split('.'); // hashedPassword db'dekı hasked password oluyor. salt ise ilk hash işlemı sırasında uretılen salt yapı
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer // suppliedPassword ise kullanıcı tarafından verılen password hash olmamış 

        return buf.toString('hex') === hashedPassword
    }
}

// ders 167'de kaldın