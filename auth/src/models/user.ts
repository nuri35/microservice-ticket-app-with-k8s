import mongoose from "mongoose";

interface UserAttrs {
    email: string;
    password: string
}

interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc
}

// bu sekılde yapıldıgında new user'a yenı bır value objeye ekleyemezsın. bırde new user create edıltıkten sonra createdAt gıbı şeyler eklıyor bunu ıstemeyebılrıız. bunu nasıl çözecegız bunun ıcın ınterface UserDoc'u takıp et

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


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

userSchema.statics.build = (attrs: UserAttrs)=>{
    return new User(attrs)
}




export {User}

