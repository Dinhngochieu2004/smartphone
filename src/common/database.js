const mongoose = require("mongoose");
const config = require("../../config/db");
module.exports = () =>{
    // mongoose.set('strictQuery', false);
    mongoose
        .connect(config.mongodb.uri)
        .then(()=> console.log(" Connected! "));
    return mongoose;    
}
