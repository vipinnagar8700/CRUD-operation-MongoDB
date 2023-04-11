const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const UserOtpVerificationSchema = new Schema({
    email: {type:String},
    otp:{type:String},
    createdAt: {type:Date},
    expiresAt: {type:Date}


});

const UserOtpVerification = mongoose.model(
    "UserOtpVerification",
    UserOtpVerificationSchema
); 

module.exports = UserOtpVerification;