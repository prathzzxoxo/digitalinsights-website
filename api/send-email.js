// Backend API endpoint for sending emails
// This file is for reference - use Formspree instead for static hosting

const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email handler
async function sendEmail(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, service, message } = req.body;

    // Validate inputs
    if (!name || !email || !service || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'info@digitalinsights-uae.com',
            subject: `New Contact Form Submission - ${service}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
                <p><strong>Service:</strong> ${escapeHtml(service)}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            `,
            replyTo: email
        });

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = { sendEmail };
