import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    to_email: { type: String, default: 'harsh.kavathiya.cg@gmail.com' },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
