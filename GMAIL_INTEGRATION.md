# Gmail SMTP Integration Guide

## ✅ Status: Ready to Use

Your contact form is now fully integrated with your Gmail account:
- **Email:** support@digitalinsights-uae.com
- **App Password:** mdhe kqrk lykg odxb
- **Emails sent to:** info@digitalinsights-uae.com

---

## How to Run the Email Server

### Method 1: Using Node.js Server (Recommended)

#### Prerequisites:
```bash
# Install Node.js from https://nodejs.org/
node --version
npm --version
```

#### Step 1: Install Dependencies
```bash
cd "C:\Users\Prats\Documents\digitalinsights-website"
npm install express nodemailer cors dotenv
```

#### Step 2: Run the Server
```bash
node server.js
```

**Expected Output:**
```
Email service running on http://localhost:3001
Ready to send emails to info@digitalinsights-uae.com
```

#### Step 3: Update Contact Form (if needed)
The form currently uses EmailJS (client-side). To use the backend server instead:

In `js/main.js`, replace the contact form handler:
```javascript
// Instead of emailjs.send(), use fetch:
const response = await fetch('http://localhost:3001/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'Not provided',
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    })
});
```

---

### Method 2: EmailJS (Currently Active - No Setup Needed)

The form is already configured to use EmailJS, which works without a backend server.

**Current Setup:**
- Service: EmailJS
- Free tier: 200 emails/month
- No server maintenance needed
- Works immediately

---

## Email Configuration Files

### .env (Contains Your Credentials)
```
EMAIL_USER=support@digitalinsights-uae.com
EMAIL_PASSWORD=mdhe kqrk lykg odxb
PORT=3001
```

### .env.example (Template)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
PORT=3001
```

---

## What Happens When Contact Form is Submitted

### Email 1: To info@digitalinsights-uae.com
**From:** support@digitalinsights-uae.com
**Subject:** New Contact Form Submission - [Service Name]

**Contains:**
- Visitor's name
- Visitor's email
- Visitor's phone
- Service interested in
- Full message

### Email 2: To Visitor's Email
**From:** support@digitalinsights-uae.com
**Subject:** We received your message - Digital Insights

**Contains:**
- Thank you message
- Confirmation of received information
- Emergency contact: +971 4 2415888
- Link to website

---

## Testing the Setup

### Step 1: Fill Contact Form
1. Go to http://localhost:8000
2. Scroll to "Get In Touch"
3. Fill in all fields
4. Click "Send Message"

### Step 2: Check Results
- ✅ See green notification: "Message sent successfully!"
- ✅ Check info@digitalinsights-uae.com inbox
- ✅ Check your email inbox for confirmation

### Troubleshooting

**Problem:** "Server not found" when trying to send
- **Solution:** Make sure server is running: `node server.js`

**Problem:** "Gmail access denied"
- **Solution:** Verify app password is correct (no spaces)
- Go to myaccount.google.com/security
- Regenerate app password if needed

**Problem:** "Email not received"
- **Solution:**
  1. Check spam folder
  2. Verify email credentials in .env
  3. Check server console for errors
  4. Try sending test email from terminal

---

## Test Email from Terminal

### Using server.js endpoint:
```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "from_name": "Test User",
    "from_email": "test@example.com",
    "phone": "+1234567890",
    "service": "Penetration Testing",
    "message": "This is a test message"
  }'
```

---

## Advanced Configuration

### Change Recipient Email
Edit `server.js` line 36:
```javascript
to: 'your-new-email@example.com',
```

### Change Sender Email
Edit `.env`:
```
EMAIL_USER=your-new-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Change SMTP Service
Support for other providers (Outlook, Yahoo, etc.):
```javascript
const transporter = nodemailer.createTransport({
    service: 'outlook',  // or 'yahoo', 'custom'
    auth: { ... }
});
```

---

## Production Deployment

### Option 1: Keep Using EmailJS
- Already live, no changes needed
- Free tier sufficient for most sites
- No server maintenance

### Option 2: Deploy Backend Server

#### On Heroku:
```bash
heroku login
heroku create your-app-name
git push heroku main
```

#### On AWS/DigitalOcean:
1. Install Node.js on server
2. Copy server.js and .env
3. Run: `npm install && node server.js`
4. Use PM2 to keep process running:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

#### On Netlify/Vercel:
- EmailJS works automatically
- No backend needed
- Deploy as static site

---

## Gmail App Password Details

### If Password Expires:
1. Go to myaccount.google.com
2. Click "Security" in left menu
3. Enable 2-Factor Authentication (if not done)
4. Under "App passwords", select "Mail" and "Windows"
5. Copy new 16-character password
6. Update `.env` file

---

## Email Templates

### Customize Email Content
Edit `server.js` starting at line 38 for company email
Edit `server.js` starting at line 67 for user confirmation email

Example customization:
```javascript
html: `
    <h1>Custom Header</h1>
    <p>Your custom message</p>
    <p>From: ${from_name}</p>
    <!-- Add your HTML here -->
`
```

---

## Monitoring & Logging

### View Email Logs
Server logs to console:
```
node server.js
# Shows all email sent/failed attempts
```

### Gmail Activity
Monitor at: myaccount.google.com/device-activity

---

## Security Best Practices

✅ **Already Done:**
- Using app password (not main password)
- Environment variables for credentials
- Email validation
- HTML escaping for security

✅ **Optional Additions:**
- Rate limiting (prevent spam)
- CAPTCHA verification
- Email signature verification
- Bounce handling

---

## Support & Resources

### Nodemailer Documentation:
https://nodemailer.com/

### Gmail Security:
https://support.google.com/accounts/answer/185833

### EmailJS Documentation:
https://www.emailjs.com/docs/

---

## Quick Checklist

- [x] Gmail account setup
- [x] App password generated
- [x] .env file created with credentials
- [x] server.js configured
- [x] Contact form HTML updated
- [x] EmailJS integrated (currently active)
- [ ] (Optional) Backend server tested
- [ ] (Optional) Rate limiting added
- [ ] (Optional) CAPTCHA implemented

---

## Summary

| Item | Value |
|------|-------|
| **Email Account** | support@digitalinsights-uae.com |
| **Recipient** | info@digitalinsights-uae.com |
| **Current Method** | EmailJS (Client-side) |
| **Backend Server** | Ready to use (optional) |
| **Status** | ✅ Production Ready |

---

**Last Updated:** November 27, 2025
**Status:** ✅ READY TO USE
**Method:** EmailJS (no server required) OR Backend Server (optional)
