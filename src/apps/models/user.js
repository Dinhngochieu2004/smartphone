const mongoose = require("../../common/database")();
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:"user"
    },
    full_name:{
        type:String,
        required:true,
    },
});
const UserModel = mongoose.model("Users", userSchema, "users");
module.exports = UserModel;