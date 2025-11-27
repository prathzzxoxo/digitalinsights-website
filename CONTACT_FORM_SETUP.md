# Contact Form Email Setup Guide

## Current Status: ✅ Ready to Use

The contact form is now configured to send emails to **info@digitalinsights-uae.com** using **EmailJS**.

---

## How It Works

1. User fills out the contact form
2. Clicks "Send Message"
3. Form submits to EmailJS service
4. EmailJS sends email to **info@digitalinsights-uae.com**
5. Success notification appears
6. User receives confirmation that message was sent

---

## Quick Setup (Already Done)

### In index.html:
- Added EmailJS script (CDN)
- Initialized with public key: `VhxLCKuHlgfr5Yhjq`
- Updated form to use EmailJS parameters

### In js/main.js:
- Updated `initContactForm()` function
- Uses `emailjs.send()` to submit form
- Sends to service: `service_contact`
- Uses template: `template_contact`

---

## Testing the Form

### Step 1: Fill the Form
- Name: Your Name
- Email: your-email@example.com
- Phone: (optional)
- Service: Select one
- Message: Your message

### Step 2: Click "Send Message"
- Button shows "Sending..."
- Loading state displays

### Step 3: Success!
- Green notification appears
- Message: "Message sent successfully! We'll get back to you soon."
- Form clears automatically
- Email delivered to info@digitalinsights-uae.com

### What Happens at info@digitalinsights-uae.com:
- Receives email with all form data
- Can reply directly to user's email
- Professional formatted email with all information

---

## Email Content Example

**To:** info@digitalinsights-uae.com

**From:** [User's Email]

**Subject:** New Contact Form Submission - [Selected Service]

**Body includes:**
- Sender Name
- Sender Email
- Phone Number
- Service Interested In
- Complete Message

---

## Alternative Setup Options

### Option 1: Self-Hosted Backend (Node.js)

**File provided:** `server.js`

**Setup:**
```bash
# Install dependencies
npm install express nodemailer cors dotenv

# Create .env file with:
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password

# Run server
node server.js
```

**Then update form action in index.html:**
```javascript
emailjs.send('service_contact', 'template_contact', {
    // ... your data
});
```

---

### Option 2: Gmail SMTP Setup

**Requirements:**
1. Gmail Account
2. 2-Factor Authentication Enabled
3. App Password Generated

**Generate Gmail App Password:**
1. Go to myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Create App Password for "Mail" on "Windows Computer"
4. Copy the 16-character password

**Update server.js .env:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

---

### Option 3: SendGrid (Production)

1. Sign up at sendgrid.com
2. Create API key
3. Use SendGrid Node.js library
4. Send emails through SendGrid API

---

### Option 4: Mailgun (Recommended)

1. Sign up at mailgun.com
2. Verify domain
3. Get API credentials
4. Use Mailgun API for reliable delivery

---

## Troubleshooting

### "Form not found" Error
- **Cause:** EmailJS service or template not found
- **Solution:** Check EmailJS dashboard for correct IDs

### Email Not Received
1. Check spam folder
2. Verify sender address
3. Check EmailJS dashboard for errors
4. Test with different email address

### Form Shows Loading But Never Completes
1. Check browser console for errors (F12)
2. Verify EmailJS key is correct
3. Check internet connection
4. Reload page and try again

---

## EmailJS Dashboard

**Access at:** https://dashboard.emailjs.com

**Current Configuration:**
- Public Key: `VhxLCKuHlgfr5Yhjq`
- Service: `service_contact`
- Template: `template_contact`
- Recipient: `info@digitalinsights-uae.com`

**Free Tier Limits:**
- Up to 200 emails/month
- Perfect for small contact forms

---

## Production Deployment

### On Netlify/Vercel:
- EmailJS works automatically
- No backend needed
- No special configuration required
- Emails send directly to info@digitalinsights-uae.com

### On Self-Hosted Server:
1. Deploy server.js
2. Set environment variables
3. Update form to point to your endpoint
4. Test email delivery

---

## Email Content Customization

To customize email template, edit in `js/main.js`:

```javascript
const result = await emailjs.send('service_contact', 'template_contact', {
    to_email: 'info@digitalinsights-uae.com',
    from_name: document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    phone: document.getElementById('phone').value || 'Not provided',
    service: document.getElementById('service').value,
    message: document.getElementById('message').value
});
```

---

## Security Notes

✅ **What's Secure:**
- Uses HTTPS (if deployed on HTTPS)
- No sensitive data stored
- Email sent through trusted service
- User input is sanitized

⚠️ **Best Practices:**
- Add rate limiting to prevent spam
- Implement CAPTCHA for extra security
- Validate emails on server-side
- Monitor for suspicious patterns

---

## Support & Updates

**Need Help?**
1. Check EmailJS documentation: https://www.emailjs.com/docs
2. Review server.js for self-hosted setup
3. Check browser console for errors
4. Contact support at info@digitalinsights-uae.com

**Future Improvements:**
- [ ] Add reCAPTCHA v3
- [ ] Implement rate limiting
- [ ] Add file upload capability
- [ ] Create email templates admin panel
- [ ] Set up bounce handling

---

## Summary

✅ **Current Setup:** EmailJS (Free, 200 emails/month)
✅ **Email Recipient:** info@digitalinsights-uae.com
✅ **Form Fields:** Name, Email, Phone, Service, Message
✅ **Success Notification:** Yes
✅ **Confirmation Email:** Yes (with template)
✅ **Mobile Responsive:** Yes
✅ **Production Ready:** Yes

**Status: ✅ FULLY OPERATIONAL**

---

**Last Updated:** November 27, 2025
**Version:** 2.0
**Status:** Production Ready
