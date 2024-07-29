const mongoose = require("mongoose");
const User = require("./user");


const PostSchema = mongoose.Schema({
    user :{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },

    Date :{
        type:Date,
        default:Date.now
    },
    content:String,
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

})

module.exports = mongoose.model("Post",PostSchema);
