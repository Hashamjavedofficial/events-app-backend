const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {Schema} = mongoose

const userSchema = new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    code:{
        type:String,
        validate(value){
            if(value !== 'the_sport_association'){
                throw new Error('Sign Up Code is Incorrect')
            }
        }
    }
})

userSchema.statics.findByCresidentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,8)
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User