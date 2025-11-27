// Simple Email Service for Digital Insights Contact Form
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email configuration - Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'support@digitalinsights-uae.com',
        pass: process.env.EMAIL_PASSWORD || 'mdhe kqrk lykg odxb'
    }
});

// Contact form endpoint
app.post('/api/send-email', async (req, res) => {
    const { from_name, from_email, phone, service, message } = req.body;

    // Validate required fields
    if (!from_name || !from_email || !service || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Send email to company
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'support@digitalinsights-uae.com',
            to: 'info@digitalinsights-uae.com',
            subject: `New Contact Form Submission - ${service}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00D9FF;">New Contact Form Submission</h2>
                    <hr style="border: 1px solid #00D9FF;">

                    <p><strong>Name:</strong> ${escapeHtml(from_name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(from_email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
                    <p><strong>Service Interested In:</strong> ${escapeHtml(service)}</p>

                    <h3 style="color: #00D9FF; margin-top: 20px;">Message:</h3>
                    <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        ${escapeHtml(message).replace(/\n/g, '<br>')}
                    </p>

                    <hr style="border: 1px solid #00D9FF; margin-top: 30px;">
                    <p style="color: #808080; font-size: 12px;">
                        This email was sent from the Digital Insights contact form.
                    </p>
                </div>
            `,
            replyTo: from_email
        });

        // Send confirmation email to user
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'support@digitalinsights-uae.com',
            to: from_email,
            subject: 'We received your message - Digital Insights',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00D9FF;">Thank You for Contacting Digital Insights</h2>

                    <p>Hi ${escapeHtml(from_name)},</p>

                    <p>We have received your message and will get back to you shortly.</p>

                    <p><strong>Your Information:</strong></p>
                    <ul>
                        <li>Service: ${escapeHtml(service)}</li>
                        <li>Contact Email: ${escapeHtml(from_email)}</li>
                    </ul>

                    <p>If you need immediate assistance, please call us at <strong>+971 4 2415888</strong> (Available 24/7)</p>

                    <hr style="border: 1px solid #00D9FF; margin-top: 30px;">
                    <p style="color: #808080;">
                        Digital Insights Consultancy<br>
                        Dubai, United Arab Emirates<br>
                        <a href="https://digitalinsights-uae.com" style="color: #00D9FF; text-decoration: none;">www.digitalinsights-uae.com</a>
                    </p>
                </div>
            `
        });

        return res.json({
            success: true,
            message: 'Email sent successfully'
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to send email'
        });
    }
});

// Escape HTML special characters
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Email service is running' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
