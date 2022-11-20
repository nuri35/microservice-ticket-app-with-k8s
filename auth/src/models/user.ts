import mongoose from "mongoose";

interface UserAttrs {
    email: string;
    password: string
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


const User = mongoose.model('User',userSchema);

const buildUser = (attrs: UserAttrs)=>{
    return new User(attrs)
} // save ederken buildUser fonksıyonunu kullancaz sonra return eden objeyı .save dıyecegız burda amacımız obje olsuturken typescriptın anlayacagı tıpleme olsun baska bırşey eklersek bıze kızsın dıye böyle bir yola gıttık. yoksa save etmeden once typescrpt anlamıyor umrunda olmuyor

// buildUser(
//     {
//         email:"saasas", password: "as",
//         sdsdsd:122121
//     }
//     ) işte kızıyor......

export {User}