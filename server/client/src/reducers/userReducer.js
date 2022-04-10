export const initialState=null;

export const reducer=(state,action)=>{
    if(action.type==="USER"){
        return action.payload;
    }
    if(action.type==="CLEAR"){
        return null;
    }
    if(action.type==="UPDATE"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type==="UPDATEPROFPIC"){
        return {
            ...state,
            profPic:action.payload
        }
    }
    if(action.type==="UPDATEPROFCOVERPIC"){
        return {
            ...state,
            profCoverPic:action.payload
        }
    }
    if(action.type==="UPDATECURRENTREPORTPOSTID"){
        return {
            ...state,
            reportPostId:action.payload
        }
    }
    if(action.type==="UPDATEPROFAUDIO"){
        return {
            ...state,
            profAudio:action.payload
        }
    }
    if(action.type==="UPDATEHOBBIES"){
        return{
            ...state,
            hobbies:action.payload
        }
    }
    return state;
} 