# Email Setup Guide - Digital Insights Website

## Current Setup

The contact form is configured to send emails to **info@digitalinsights-uae.com** using **Formspree**, a free email form service.

### How It Works

1. User fills out the contact form on the website
2. Form is submitted to Formspree's servers (`https://formspree.io/f/xwpzonle`)
3. Formspree receives the submission and forwards it to `info@digitalinsights-uae.com`
4. User sees a success notification

### Formspree Configuration

- **Form ID**: `xwpzonle`
- **Recipient Email**: `info@digitalinsights-uae.com`
- **Service**: Free (up to 50 submissions per month)

**Status**: ✅ Ready to use - No configuration needed

---

## Alternative Setup Options

### Option 1: EmailJS (Recommended for Static Sites)

1. Visit https://www.emailjs.com
2. Sign up for free account
3. Create an email service and template
4. Update the JavaScript:

```javascript
// In js/main.js - Replace the fetch approach
emailjs.init('YOUR_PUBLIC_KEY');

const serviceID = 'gmail'; // or your service ID
const templateID = 'contact_form'; // your template ID

emailjs.send(serviceID, templateID, {
    to_email: 'info@digitalinsights-uae.com',
    from_name: formData.get('name'),
    from_email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    message: formData.get('message')
});
```

### Option 2: AWS SES (Production)

Requires AWS account setup:
1. Create SES verified email identity
2. Set up SMTP credentials
3. Use backend service with Node.js/Express
4. Deploy to AWS Lambda or EC2

### Option 3: SendGrid (Production)

1. Sign up at https://sendgrid.com
2. Create API key
3. Implement backend handler
4. Send via SendGrid API

### Option 4: Self-hosted Backend (Node.js + Nodemailer)

For production deployments:

1. **Install dependencies**:
```bash
npm install nodemailer cors express dotenv
```

2. **Create express server** (`server.js`):
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/api/send-email', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'info@digitalinsights-uae.com',
            subject: `New Contact: ${service}`,
            html: `
                <h2>Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
            `,
            replyTo: email
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(3001, () => console.log('Server running'));
```

3. **Update contact form** in `index.html`:
```html
<form id="contactForm" action="/api/send-email" method="POST">
```

4. **Create .env file**:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

5. **Run server**:
```bash
node server.js
```

---

## Testing the Email

### Test with Formspree:

1. Go to http://localhost:8000
2. Scroll to Contact section
3. Fill out the form
4. Click "Send Message"
5. You should see a success notification
6. Check **info@digitalinsights-uae.com** inbox

### Formspree Dashboard:

1. Visit https://formspree.io
2. Log in with your account
3. View submissions in the dashboard
4. Configure redirect after submission (optional)

---

## Current Implementation Details

### Frontend (HTML)
- Form ID: `contactForm`
- Form action: `https://formspree.io/f/xwpzonle`
- Method: `POST`

### Frontend (JavaScript)
- File: `js/main.js`
- Function: `initContactForm()`
- Features:
  - Prevents default form submission
  - Shows loading state
  - Displays success/error notifications
  - Auto-resets form on success

### Fields
- Name (required)
- Email (required)
- Phone (optional)
- Service (required - dropdown)
- Message (required - textarea)

---

## Email Template (What Recipients See)

```
To: info@digitalinsights-uae.com
From: [User's email]
Subject: [User's name] - [Selected service]

Message contents with all form data
```

---

## Troubleshooting

### Form not sending?
1. Check browser console for errors (F12 → Console)
2. Verify form has `action="https://formspree.io/f/xwpzonle"`
3. Ensure email field has `type="email"`
4. Check that all required fields are filled

### Email not received?
1. Check spam/junk folder
2. Verify recipient email is correct
3. Check Formspree dashboard for errors
4. Ensure form submission was successful (check notification)

### CORS errors?
- Formspree handles CORS automatically
- No additional configuration needed
- If using custom backend, add CORS headers:
```javascript
app.use(cors());
```

---

## Production Deployment

### On Netlify/Vercel:
- Formspree works automatically
- No backend needed
- Free tier is sufficient

### On Custom Server:
1. Deploy backend server
2. Update form action to your server endpoint
3. Configure environment variables
4. Set up SSL certificate

### On AWS:
1. Use Lambda function with SES
2. API Gateway for HTTP endpoint
3. Environment variables in Lambda config

---

## Security Considerations

✅ **Current Setup (Formspree)**:
- SPAM protection built-in
- Rate limiting
- No sensitive data stored on frontend
- HTTPS encrypted

### Additional Measures:
1. Add reCAPTCHA v3:
```html
<script src="https://www.google.com/recaptcha/api.js"></script>
```

2. Rate limit form submissions:
```javascript
const lastSubmit = localStorage.getItem('lastFormSubmit');
if (lastSubmit && Date.now() - lastSubmit < 3000) {
    showNotification('Please wait before submitting again', 'error');
    return;
}
```

3. Validate email format server-side
4. Sanitize all inputs
5. Use HTTPS only

---

## Support

- **Formspree Docs**: https://formspree.io/docs
- **EmailJS Docs**: https://www.emailjs.com/docs
- **Nodemailer Docs**: https://nodemailer.com/

---

**Last Updated**: November 27, 2025
**Status**: ✅ Fully Configured
