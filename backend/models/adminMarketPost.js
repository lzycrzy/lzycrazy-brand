import mongoose from 'mongoose'
const marketPost=new mongoose.Schema({
fullName:{
    type:String,
    require:true
},
type:{
    type:String,
    enum:['video','image'],
    require:true
},
postUrl:{
    type:String,
    require:true
},
thumnail:{
    type:String,
},
url:{
    type:String
},
postDate:{
    type:Date,
    require:true
}

})
export default mongoose.model("marketPost",marketPost)