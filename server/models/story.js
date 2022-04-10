const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const storySchema=new mongoose.Schema({
    file:{
        type:String,
        required:true
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    },
    isHighlight:{
        type: Boolean,
        default:false
    },
},{timestamps:true});

mongoose.model("Story",storySchema);