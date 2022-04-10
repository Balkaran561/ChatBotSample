const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const chatroomSchema=new mongoose.Schema({
    participants:[{type:ObjectId,ref:"User"}],
    isInHiddenMode: {
        type:Boolean
    }
});

mongoose.model("Chatroom",chatroomSchema);

