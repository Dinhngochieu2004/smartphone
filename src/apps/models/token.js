const mongoose = require("../../common/database")();
const tokenSchema = new mongoose.Schema(
    {
        customerId:{
            type:mongoose.Types.ObjectId,
            required:true,
        },
        accessToken:{
            type:String,
            required: true,
        },
        refreshToken:{
            type: String,
            required: true,
        }
    },
    { timestamps: true}
);
const TokenModel = mongoose.model("tokens", tokenSchema,"Tokens");
module.exports = TokenModel;