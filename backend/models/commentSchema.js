import mongoose, { Schema } from 'mongoose'
const comment=new Schema({
post_id:{
    type:Schema.Types.ObjectId,
    ref:"post",
    require:true
},
author_id:{
    type:Schema.Types.ObjectId,
    ref:"User",
    require:true
},
message:{
    type:String,
    require:true
}
},{timeStamps:true})
export default mongoose.model('comment',comment)