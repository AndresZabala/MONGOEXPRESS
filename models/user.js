const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const SECRET_KEY_JWT_CAR_API = 1234

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    isCustomer: Boolean,
    email: {
        type: String, 
        required : true, 
        unique : true //Valida que dos usuarios no tenga el mismo email
    },
    password : {
        type : String, 
        required : true
    },
    date: {type:Date, default:Date.now}
})

userSchema.methods.generateJWT = function(){
    return jwt.sign({_id: this._id, name: this.name}, SECRET_KEY_JWT_CAR_API) 
}

const User = mongoose.model('user', userSchema)

module.exports = User