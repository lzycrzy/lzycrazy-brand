import mongoose, { Schema } from 'mongoose'
const like=new Schema({
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
},{timeStamps:true})
export default mongoose.model('like',like)