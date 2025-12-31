# Google Apps Script Setup Guide

This guide shows you how to set up Google Apps Script to send agreement emails - completely free!

## 🎯 **Why Google Apps Script?**

✅ **Completely FREE** - No costs whatsoever  
✅ **Reliable** - Google's infrastructure  
✅ **Easy Setup** - No complex configuration  
✅ **Professional Emails** - HTML email templates  
✅ **No Dependencies** - Built into Google Workspace  

## 📋 **Setup Steps (5 Minutes)**

### **Step 1: Create Google Apps Script**
1. Go to [https://script.google.com/home](https://script.google.com/home)
2. Click **"New Project"**
3. Delete any existing code
4. Copy the entire contents of `google-apps-script/agreement-email-sender.gs`
5. Paste it into the script editor

### **Step 2: Configure the Script**
At the top of the script, update these values:

```javascript
const CONFIG = {
  // Your email address (as sender)
  SENDER_EMAIL: "your-email@gmail.com",
  
  // Your producer name
  PRODUCER_NAME: "Your Producer Name",
  
  // Your website domain
  WEBSITE_DOMAIN: "yourbeatstore.com"
};
```

### **Step 3: Save and Test**
1. Press **Ctrl+S** (or Cmd+S) to save the project
2. Give it a name (e.g., "Beat Store Agreement Emails")
3. Click **"Run"** > **"testAgreementEmail"**
4. Grant permissions when prompted (this is normal)
5. Check your email for the test agreement

### **Step 4: Deploy as Web App**
1. Click **"Deploy"** > **"New deployment"**
2. Click the gear icon ⚙️ and select **"Web app"**
3. Configure settings:
   - **Description**: "Beat Store Agreement Email Service"
   - **Execute as**: "Me" (your Google account)
   - **Who has access**: "Anyone" (required for API calls)
4. Click **"Deploy"**
5. **Copy the Web app URL** - this is important!

### **Step 5: Configure Vercel**
In Vercel Dashboard → Settings → Environment Variables:
```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the URL from Step 4.

## 🚀 **Testing the Complete Flow**

### **Test 1: Script Function**
1. In Google Apps Script editor
2. Click **"Run"** > **"testAgreementEmail"**
3. Check your email for the test agreement

### **Test 2: API Integration**
1. Deploy your Vercel app
2. Complete a test agreement on your site
3. Check if email arrives
4. Check Vercel function logs for any errors

## 📧 **What Customers Receive**

### **Email Features:**
- 🎨 **Professional HTML Design**
- 📊 **Status Indicator** (Accepted/Declined)
- 📄 **Full Agreement Details**
- 👥 **Parties Information**
- ⚖️ **Important Terms Reminder**
- 💾 **Record Keeping Message**

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

## 🔧 **Troubleshooting**

### **Permission Issues**
- When first running the script, Google will ask for permissions
- Click "Advanced" → "Go to [Project Name] (unsafe)"
- This is normal - it's your own script

### **Email Not Sending**
1. Check Vercel function logs
2. Verify GOOGLE_SCRIPT_URL is correct
3. Test the script directly in Google Apps Script
4. Make sure permissions are granted

### **Web App URL Issues**
- Make sure you copied the full URL ending in `/exec`
- Don't use the `/edit` URL
- URL should look like: `https://script.google.com/macros/s/ABC123/exec`

### **Permission Errors**
- Go to Google Apps Script
- Click "Run" > "testAgreementEmail"
- Grant all requested permissions
- Redeploy the web app if needed

## 📊 **Email Limits**

Google Apps Script has generous limits:
- **100 emails/day** for regular Gmail accounts
- **Unlimited** for Google Workspace accounts
- **Perfect** for most beat stores

## 🎉 **Benefits**

✅ **Zero Cost** - Completely free  
✅ **Professional** - Beautiful HTML emails  
✅ **Reliable** - Google's infrastructure  
✅ **Simple** - Easy to set up and maintain  
✅ **Scalable** - Handles hundreds of emails  
✅ **Secure** - Google's security  

## 📞 **Next Steps**

1. **Set up Google Apps Script** (5 minutes)
2. **Configure environment variables** (2 minutes)
3. **Test the integration** (3 minutes)
4. **Go live!** 🚀

## 🔄 **Complete Flow**

```
Customer Completes Agreement
    ↓
Vercel API Calls Google Apps Script
    ↓
Google Apps Script Sends Professional Email
    ↓
Customer Receives Agreement Copy
    ↓
Producer Gets Notification (if agreed)
```

**Your free email system is ready to go!** 📧✨

This setup costs nothing and provides professional agreement emails that build trust and provide legal protection for both you and your customers.
