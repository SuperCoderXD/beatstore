# Email Setup Guide for Agreement Emails

This guide shows you how to configure email sending so customers receive a copy of their license agreement.

## 📧 **Choose an Email Service**

### **Option 1: Resend (Recommended - Easiest)**
✅ **Pros:** Modern API, 100 free emails/day, great for Next.js  
✅ **Setup:** 5 minutes  
✅ **Cost:** Free tier, then $0.10/100 emails

**Setup Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (takes 5-10 minutes)
3. Get your API key from Dashboard → API Keys
4. Add to Vercel environment variables:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   FROM_EMAIL=agreements@yourdomain.com
   ```

### **Option 2: SendGrid**
✅ **Pros:** Reliable, 100 free emails/day  
✅ **Setup:** 10 minutes  
✅ **Cost:** Free tier, then paid plans

**Setup Steps:**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your sender identity
3. Get your API key from Settings → API Keys
4. Add to Vercel environment variables:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
   FROM_EMAIL=agreements@yourdomain.com
   ```

### **Option 3: SMTP (Your Own Email)**
✅ **Pros:** Use your existing email (Gmail, Outlook, etc.)  
✅ **Setup:** 15 minutes  
✅ **Cost:** Free (using your existing email)

**Setup Steps:**
1. Get SMTP settings from your email provider
2. Add to Vercel environment variables:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

## 🚀 **Quick Setup with Resend (Recommended)**

### **Step 1: Sign Up for Resend**
1. Go to [resend.com/signup](https://resend.com/signup)
2. Create account (use GitHub or Google)
3. Verify your email

### **Step 2: Verify Your Domain**
1. In Resend Dashboard → Domains → Add Domain
2. Enter your domain (e.g., `yourbeatstore.com`)
3. Add DNS records (they provide exact instructions)
4. Wait for verification (usually 5-10 minutes)

### **Step 3: Get API Key**
1. Go to Dashboard → API Keys
2. Click "Create API Key"
3. Give it a name (e.g., "Beat Store Agreements")
4. Copy the API key

### **Step 4: Configure Vercel**
In Vercel Dashboard → Settings → Environment Variables:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
FROM_EMAIL=agreements@yourbeatstore.com
```

### **Step 5: Test It**
1. Deploy your Vercel app
2. Complete a test agreement
3. Check if email arrives!

## 📋 **Environment Variables Reference**

Add these to your Vercel environment:

```env
# Required for email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=agreements@yourdomain.com

# OR use SendGrid instead
# SENDGRID_API_KEY=your_sendgrid_api_key
# FROM_EMAIL=agreements@yourdomain.com

# OR use SMTP instead
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# FROM_EMAIL=your-email@gmail.com

# Required for app
WHOP_COMPANY_ID=your_whop_company_id
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

## 🎯 **What Customers Will Receive**

### **Email Subject:**
`Beat License Agreement - [Beat Name]`

### **Email Content:**
- ✅ Professional HTML design
- ✅ Agreement status (Accepted/Declined)
- ✅ License details (beat, type, price, date)
- ✅ Parties information (producer and customer)
- ✅ Important notice about terms
- ✅ "Keep for your records" message

### **Visual Design:**
- Clean, modern layout
- Color-coded status (green for agreed, red for declined)
- Professional typography
- Mobile-responsive
- Branded with your producer info

## 🔧 **Troubleshooting**

### **Email Not Sending?**
1. Check Vercel function logs
2. Verify environment variables are set
3. Check email service API key is valid
4. Make sure domain is verified (for Resend/SendGrid)

### **Domain Verification Issues?**
1. Follow DNS instructions exactly
2. Wait 10-15 minutes for DNS propagation
3. Use DNS checker tools to verify records

### **Gmail SMTP Issues?**
1. Use "App Password" not your regular password
2. Enable 2-factor authentication first
3. Create App Password in Google Account settings

## 📊 **Email Analytics (Optional)**

### **Resend Dashboard:**
- Track delivery rates
- Monitor open rates
- View click-through rates
- See email history

### **SendGrid Dashboard:**
- Advanced analytics
- Delivery reports
- Spam complaint tracking
- Global deliverability insights

## 🎉 **Benefits of Email Agreements**

✅ **Professional** - Customers get official documentation  
✅ **Record Keeping** - Both parties have proof of agreement  
✅ **Legal Protection** - Written record of terms acceptance  
✅ **Customer Service** - Easy reference for questions  
✅ **Automation** - No manual work required  
✅ **Branding** - Reinforces your professional image  

**Your customers will love getting professional agreement emails!** 📧✨
