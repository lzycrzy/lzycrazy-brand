import mongoose, { Schema } from 'mongoose'
const post=new Schema({
author_id:{
    type:Schema.Types.ObjectId,
    ref:"User",
    require:true
},
mediaUrl:{
    type:String,
    require:true
},
mediaType:{
    type:String,
    enum:['image','video']
},
location:{
    type:String,
},
feeling:{
    type:String,
},
taggedUser:[{
    type:Schema.Types.ObjectId,
    ref:"User"
}],
description:{
    type:String
}
},{timeStamps:true})
export default mongoose.model('post',post)