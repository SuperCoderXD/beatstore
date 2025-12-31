# Gmail SMTP Setup Guide

This guide shows you how to set up Gmail SMTP for sending agreement emails - completely free!

## 🎯 **Why Gmail SMTP?**

✅ **Completely FREE** - No costs whatsoever  
✅ **Reliable** - Google's email infrastructure  
✅ **Easy Setup** - Just need app password  
✅ **Professional** - Your own email as sender  
✅ **No Dependencies** - Built into your Vercel app  

## 📋 **Setup Steps (5 Minutes)**

### **Step 1: Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security"
3. Enable "2-Step Verification" (required for app passwords)

### **Step 2: Create App Password**
1. In Google Account Settings → Security
2. Click "App passwords" (under 2-Step Verification)
3. Select:
   - App: "Mail"
   - Device: "Other (Custom name)" → Enter "Beat Store"
4. Click "Generate"
5. **Copy the 16-character password** (you provided: `upif dduc ncqz bxav`)

### **Step 3: Configure Vercel Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=upif dduc ncqz bxav

# Producer email (for notifications)
PRODUCER_EMAIL=your-email@gmail.com

# Required for app
WHOP_COMPANY_ID=your_whop_company_id
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

**Important:** Replace `your-email@gmail.com` with your actual Gmail address.

### **Step 4: Test the Integration**
1. Deploy your Vercel app
2. Complete a test agreement on your site
3. Check your email for the agreement copy!

## 📧 **What Customers Receive:**

### **Professional Email Features:**
- 🎨 **Modern HTML Design** - Clean, professional layout
- 📊 **Status Indicator** - Green for accepted, red for declined
- 📄 **Full Agreement Details** - Beat, license, price, date
- 👥 **Parties Information** - Producer and customer details
- ⚖️ **Important Terms Reminder** - Key terms summary
- 💾 **Record Keeping** - "Keep for your records" message

### **Email Example:**
```
Subject: Beat License Agreement - "Dark Trap Beat"

✅ AGREEMENT ACCEPTED
You have agreed to the license terms and can use the beat for profit use...

License Details:
• Beat Title: "Dark Trap Beat"
• License Type: Basic License
• License Fee: $29.99
• Agreement Date: December 31, 2025
```

## 🔧 **Environment Variables Reference:**

```env
# Required for Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=upif dduc ncqz bxav

# Optional: Producer notifications
PRODUCER_EMAIL=your-email@gmail.com

# Required for app
WHOP_COMPANY_ID=your_whop_company_id
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

## 🚀 **Complete Flow:**

```
Customer Completes Agreement
    ↓
Vercel API Sends Email via Gmail SMTP
    ↓
Customer Receives Professional Agreement Email
    ↓
Producer Gets Notification (if agreed)
```

## 🔧 **Troubleshooting:**

### **Authentication Failed**
- Make sure 2-factor authentication is enabled
- Use the app password, not your regular password
- Check for extra spaces in the app password

### **Email Not Sending**
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Make sure Gmail account has 2FA enabled
4. Try regenerating the app password

### **Rate Limits**
- Gmail allows ~500 emails/day via SMTP
- Perfect for most beat stores
- If you need more, consider Google Workspace

## 📊 **Email Limits:**

- **Gmail**: ~500 emails/day (generous limit)
- **Google Workspace**: Higher limits
- **Free**: No API costs or subscriptions

## 🎉 **Benefits:**

✅ **Zero Cost** - Completely free  
✅ **Professional** - Your own email as sender  
✅ **Reliable** - Google's email infrastructure  
✅ **Simple** - Easy to set up and maintain  
✅ **Scalable** - Handles hundreds of emails  
✅ **Secure** - Google's security  

## 📞 **Next Steps:**

1. **Enable 2FA** on your Google Account (2 minutes)
2. **Create App Password** (2 minutes)
3. **Configure Vercel** (1 minute)
4. **Test Integration** (2 minutes)
5. **Go Live!** 🚀

## 🔄 **What Happens Behind the Scenes:**

1. **Customer agrees** to terms on your site
2. **Vercel API** receives the agreement data
3. **Nodemailer** connects to Gmail SMTP
4. **Gmail sends** professional HTML email
5. **Customer receives** agreement copy
6. **Producer gets** notification (if configured)

## 📧 **Email Features Included:**

- **HTML Design** - Professional, mobile-responsive
- **Status Colors** - Green for accepted, red for declined
- **Full Details** - All agreement information
- **Branding** - Your producer name and contact
- **Record Keeping** - "Keep for your records" message
- **Legal Protection** - Written documentation

**Your free Gmail SMTP email system is ready!** 📧✨

This setup costs nothing, uses your existing Gmail account, and provides professional agreement emails that build trust and provide legal protection for both you and your customers.
