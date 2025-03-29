const mongoose = require("../../common/database")();
const commentsSchema = new mongoose.Schema({
    name: {
        type :String,
        required: true,
    },
    email:{
        type: String,
        required:true,
    },
    content:{
        type: String,
        required:true,
    },
    product_id:{
        type: String,
        required: true,
    }
},
{timestamps: true}
);
const CommentsModel = mongoose.model("Comments", commentsSchema,"comments");
module.exports = CommentsModel;
