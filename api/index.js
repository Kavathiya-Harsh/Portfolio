import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './lib/db.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Early Environment Check
if (!process.env.MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables.');
}

// API Routes
app.post('/api/messages', async (req, res) => {
    try {
        await connectToDatabase();
        
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: 'Message successfully archived' });
    } catch (error) {
        console.error('Submission Error:', error.message);
        res.status(500).json({ 
            error: 'Could not process message at this time', 
            details: process.env.NODE_ENV === 'production' ? null : error.message 
        });
    }
});

// Root route for health check
app.get('/api', (req, res) => {
    res.json({ status: 'API is running', version: '1.0.0' });
});

// Export the app for Vercel Serverless Functions
export default app;

// Local Development Server (Only runs if executed directly)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Development server running on http://127.0.0.1:${PORT}`);
    });
}
