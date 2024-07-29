const mongoose = require("mongoose");
try{
    mongoose.connect("mongodb://localhost:27017/miniprojectbysheryains");
}catch(err){
    console.log("error in connection");
}

const UserSchema = mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    email:String,
    password:String,
    profile:{
        type:String,
        default:"download.jpeg"
    },
    posts :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ]
})

module.exports = mongoose.model("User",UserSchema);
