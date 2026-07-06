import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import connectToDatabase from './lib/db.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();

// Middleware — compression must be FIRST to gzip all responses
app.use(compression({ level: 6, threshold: 1024 }));

// CORS — allow all localhost variants for development
const allowedOrigins = [
    'https://harshkavathiya.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
];
app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like server-to-server or Vite proxy)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(null, true); // Allow all in dev, log warning
        }
    }, 
    credentials: true 
}));
app.use(express.json({ limit: '10kb' }));

// Early Environment Check
if (!process.env.MONGODB_URI) {
    console.error('⚠️  MONGODB_URI is not defined in environment variables.');
}
if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  GMAIL_APP_PASSWORD is not set — email notifications will be disabled.');
}

// Configure Nodemailer transporter (Gmail with App Password)
let emailTransporter = null;
const GMAIL_USER = process.env.GMAIL_USER || 'harsh.kavathiya.cg@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, ''); // strip any accidental spaces

if (GMAIL_APP_PASSWORD) {
    // Validate: Gmail App Passwords are exactly 16 alphanumeric characters
    if (GMAIL_APP_PASSWORD.length !== 16) {
        console.warn(`⚠️  GMAIL_APP_PASSWORD looks malformed (got ${GMAIL_APP_PASSWORD.length} chars, expected 16).`);
        console.warn('   → Generate a fresh one at: https://myaccount.google.com/apppasswords');
    }

    emailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // SSL — more reliable than service:'gmail'
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: true,
        },
    });

    // Non-blocking startup verification
    emailTransporter.verify()
        .then(() => console.log('✅ Email transporter verified — ready to send mail'))
        .catch((err) => {
            console.error('❌ Email transporter verification failed:', err.message);
            if (err.message.includes('535') || err.message.includes('Username and Password')) {
                console.error('   → Fix: Your Gmail App Password is invalid or expired.');
                console.error('   → Steps to fix:');
                console.error('   →   1. Go to https://myaccount.google.com/apppasswords');
                console.error('   →   2. Delete the old password and create a new one.');
                console.error('   →   3. Paste the new 16-char password into .env as GMAIL_APP_PASSWORD');
                console.error('   →   4. Restart the server.');
            }
            // Don't crash — server still functions, emails just won't send
            emailTransporter = null;
        });
}

/**
 * Send email notification for a new contact message
 */
async function sendEmailNotification({ name, email, message }) {
    if (!emailTransporter) {
        console.warn('📧 Email skipped — no GMAIL_APP_PASSWORD configured');
        return { sent: false, reason: 'not_configured' };
    }

    try {
        const mailOptions = {
            from: `"Portfolio Contact" <${GMAIL_USER}>`,
            to: GMAIL_USER,
            replyTo: email,
            subject: `🚀 Portfolio Message from ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 24px 32px;">
                        <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">📬 New Contact Message</h1>
                    </div>
                    <div style="padding: 32px;">
                        <div style="margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid #3b82f6;">
                            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 4px;">From</p>
                            <p style="color: #f1f5f9; font-size: 16px; margin: 0; font-weight: 500;">${name}</p>
                        </div>
                        <div style="margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid #06b6d4;">
                            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 4px;">Email</p>
                            <p style="color: #f1f5f9; font-size: 16px; margin: 0;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></p>
                        </div>
                        <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid #8b5cf6;">
                            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 8px;">Message</p>
                            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                        <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;" />
                        <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
                            Sent from your Portfolio • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </p>
                    </div>
                </div>
            `,
        };

        const info = await emailTransporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return { sent: false, reason: error.message };
    }
}

// API Routes
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let dbSaved = false;
        let emailResult = { sent: false };

        // 1. Save to MongoDB Atlas
        try {
            await connectToDatabase();
            const newMessage = new Message({ name, email, message });
            await newMessage.save();
            dbSaved = true;
            console.log('✅ Message saved to database');
        } catch (dbError) {
            console.error('❌ DB save error:', dbError.message);
        }

        // 2. Send email notification (server-side, no client dependency)
        try {
            emailResult = await sendEmailNotification({ name, email, message });
        } catch (emailError) {
            console.error('❌ Email error:', emailError.message);
        }

        // 3. Respond based on results
        if (dbSaved || emailResult.sent) {
            res.status(201).json({ 
                success: true, 
                message: 'Message delivered successfully',
                dbSaved,
                emailSent: emailResult.sent,
            });
        } else {
            res.status(500).json({ 
                error: 'Could not process message at this time',
                details: 'Both database and email delivery failed'
            });
        }
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
    res.json({ status: 'API is running', version: '2.0.0' });
});

// Export the app for Vercel Serverless Functions
export default app;

// Local Development Server
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

if (!isProduction || !isVercel) {
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
        console.log(`🚀 Backend server active on port ${PORT}`);
    });
}
