import mongoose from "mongoose";
import { Password } from "../service/password";

interface UserAttrs {
    email: string;
    password: string
}

interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc
}


interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type:String, //  mongoose ozel birşey ts'lik atama degıl
        required: true
    },
    password: {
        type:String, 
        required: true
    }
})

//db'ye bır verı kaydettıgımızde her seferde bu fonksıyonu burada calsıtracagız bu fonksıyondada this diyerek userSchema'dan bahsedıyoruz save ederkende bu model'e bir password gelıor onuda this.get diyerek almısız
userSchema.pre('save', async function(done) {
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed) // artık password degıskenımıze hashed'dakı deger oluyor.  save ederken password artk hashlenmıs degerı db'ye kaydetmiş oluyoruz 
    }
    done()
})


userSchema.statics.build = (attrs: UserAttrs)=>{
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);





export {User}

//ders 173 desin