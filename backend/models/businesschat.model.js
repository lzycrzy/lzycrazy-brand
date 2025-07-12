import mongoose from 'mongoose';

const businessChatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
    },
    image: {
        type: String
    }
}, {timestamps: true})

const BusinessChat = mongoose.model('BusinessChat', businessChatSchema);
export default BusinessChat;