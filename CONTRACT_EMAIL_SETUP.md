# 🎵 Contract Email Delivery Setup Guide

## 🎯 **Solution Overview**
We're using Google Apps Script + Whop Webhooks to automatically send personalized license contracts to customers immediately after purchase.

## 📋 **What This Solves**
- ✅ **Automatic contract delivery** - No manual intervention needed
- ✅ **Personalized contracts** - Customer name + date included
- ✅ **Legal compliance** - Proper license terms for each tier
- ✅ **Professional delivery** - HTML email contracts like BeatStars
- ✅ **Reliable system** - Webhooks trigger instantly on purchase

## 🚀 **Setup Steps**

### **Step 1: Google Apps Script Setup**
1. **Create New Project**
   - Go to [script.google.com/home/projects](https://script.google.com/home/projects)
   - Click "New Project" → "Apps Script"

2. **Paste the Code**
   - Copy contents of `google-apps-script/contract-email-sender.gs`
   - Replace configuration values:
     ```javascript
     const CONFIG = {
       SENDER_EMAIL: "your-email@example.com",     // Your email
       SENDER_NAME: "Your Beat Store",           // Your store name
       BEATSTORE_DOMAIN: "yourbeatstore.com"        // Your domain
     };
     ```

3. **Deploy the Script**
   - Click "Deploy" → "New Deployment"
   - Set "Execute as: Me" (your Google account)
   - Set "Who has access: Anyone"
   - Copy the Web app URL

4. **Get Script ID**
   - From deployed script, copy the ID from URL:
   - URL: `https://script.google.com/macros/s/SCRIPT_ID/exec`
   - SCRIPT_ID is the part after `/s/`

### **Step 2: Webhook Configuration**
1. **Get Webhook URL**
   - Your webhook endpoint: `https://yourbeatstore.com/api/webhooks/whop`

2. **Configure in Whop**
   - Go to Whop Dashboard → Settings → Webhooks
   - Add webhook URL for `payment.succeeded` events
   - Set secret key (optional but recommended)

### **Step 3: Environment Variables**
Add these to your `.env.local` file:
```env
GOOGLE_APPS_SCRIPT_TOKEN=your_google_script_token
NEXTAUTH_URL=https://yourbeatstore.com
```

## 🔄 **How It Works**

### **Purchase Flow:**
1. Customer buys beat through Whop
2. Whop sends `payment.succeeded` webhook
3. Your webhook extracts buyer info + product details
4. Triggers Google Apps Script to send contract email
5. Customer receives personalized HTML contract immediately

### **Data Extraction:**
```javascript
// From Whop webhook payload:
const buyerName = payment.user.name;
const buyerEmail = payment.user.email;
const beatTitle = payment.product.title;
const licenseType = extractFromTitle(product.title); // basic/premium/unlimited
const price = payment.final_amount;
```

### **License Type Detection:**
```javascript
function extractLicenseType(productTitle) {
  if (title.includes("basic")) return "basic";
  if (title.includes("premium")) return "premium"; 
  if (title.includes("unlimited")) return "unlimited";
  return "basic";
}
```

## 🧪 **Testing the Setup**

### **Test Webhook:**
```bash
curl -X POST https://yourbeatstore.com/api/webhooks/whop \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment.succeeded",
    "data": {
      "user": {
        "name": "Test Customer",
        "email": "test@example.com"
      },
      "product": {
        "title": "Test Beat - Basic License",
        "id": "prod_test123"
      },
      "final_amount": 29.99
    }
  }'
```

### **Test Google Script:**
```bash
curl -X POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "functionName": "sendContractEmail",
    "parameters": {
      "buyerName": "Test Customer",
      "buyerEmail": "test@example.com",
      "beatTitle": "Test Beat",
      "licenseType": "basic",
      "price": 29.99,
      "purchaseDate": "12/30/2025"
    }
  }'
```

## 📧 **Customization Options**

### **Update License Terms:**
- Edit terms in `/manage/license-terms`
- Changes automatically apply to new contracts
- Google Apps Script fetches latest terms for each contract

### **Email Template Customization:**
- Modify the HTML in `generateContractHTML()` function
- Add your branding, colors, logo
- Include additional legal sections as needed

## 🔒 **Security Considerations**

### **Webhook Security:**
- Verify webhook signatures (Whop provides this)
- Rate limit webhook endpoints
- Log all webhook requests for debugging

### **Email Security:**
- Google Apps Script runs under your account
- No sensitive API keys in client-side code
- Use environment variables for all credentials

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Google Apps Script not triggering**
   - Check deployment permissions
   - Verify Script ID is correct
   - Ensure authentication token is valid

2. **Webhook not receiving data**
   - Check Whop webhook configuration
   - Verify webhook URL is accessible
   - Check server logs for errors

3. **License terms not loading**
   - Ensure beatstore API is accessible from Google Script
   - Check CORS settings if needed
   - Verify API token permissions

## 📞 **Support**

If you encounter issues:
1. Check server logs: `Your beatstore → Logs`
2. Check Google Apps Script executions: `script.google.com → Executions`
3. Verify webhook payload structure in Whop docs
4. Test each component individually before full integration

## 🎉 **Success Indicators**

When working correctly:
- ✅ Webhook receives payment data instantly
- ✅ Google Apps Script sends email within 30 seconds
- ✅ Customer receives professional HTML contract
- ✅ All data logged for debugging
- ✅ No manual intervention required

This system provides the same professional contract delivery experience as major beat licensing platforms!
