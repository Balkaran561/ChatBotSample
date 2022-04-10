const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const reportSchema=new mongoose.Schema({
    postId:{
        type:ObjectId,
        ref:"Post"
    },
    reportedBy:{
        type:ObjectId,
        ref:"User"
    },
    reason:{
        type:String,
        required:true
    }
},{timestamps:true});

mongoose.model("Report",reportSchema);