// Google Apps Script for sending contract emails
// Setup: https://script.google.com/home/projects/ -> New Project -> Apps Script

// Configuration
const CONFIG = {
  // Your email address
  SENDER_EMAIL: "your-email@example.com",
  SENDER_NAME: "Your Beat Store",
  
  // Your beat store domain
  BEATSTORE_DOMAIN: "yourbeatstore.com"
};

// Webhook endpoint URL (replace with your actual deployment)
const WEBHOOK_URL = "https://yourbeatstore.com/api/webhooks/whop";

// License terms cache (to avoid repeated API calls)
let licenseTermsCache = null;

// Function to fetch license terms from your beatstore
function fetchLicenseTerms() {
  try {
    const url = `${CONFIG.BEATSTORE_DOMAIN}/api/license-terms`;
    const response = UrlFetchApp.fetch(url, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + PropertiesService.getScriptProperties().getProperty("API_TOKEN")
      }
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      licenseTermsCache = data.success ? data.terms : null;
      return licenseTermsCache;
    }
  } catch (error) {
    Logger.log("Failed to fetch license terms: " + error.toString());
    return null;
  }
}

// Function to determine license type from product title
function extractLicenseType(productTitle) {
  if (productTitle.toLowerCase().includes("basic")) return "basic";
  if (productTitle.toLowerCase().includes("premium")) return "premium";
  if (productTitle.toLowerCase().includes("unlimited")) return "unlimited";
  return "basic"; // fallback
}

// Function to generate contract HTML
function generateContractHTML(buyerName, beatTitle, licenseType, purchaseDate, price) {
  const terms = licenseTermsCache?.[licenseType] || getDefaultTerms(licenseType);
  
  const canDoList = terms?.canDo || [
    "Use the beat for your recording, mix, and master",
    "Distribute your song on Spotify, Apple Music, etc.",
    "Use for music videos within the limits specified",
    "Perform live (subject to terms above)",
    "Keep 100% of master recording royalties"
  ];

  const cannotDoList = terms?.cannotDo || [
    "Transfer or resell this license to another artist",
    "Register the beat with Content ID as your own",
    "Claim copyright ownership of the underlying beat",
    "Use the beat in film/TV without additional license",
    "Create derivative beats from this instrumental"
  ];

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${terms.name} - ${beatTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 20px 0; }
        .signature { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; }
        .highlight { background-color: #f0f0f0; padding: 10px; border-left: 4px solid #000; }
        h1 { color: #000; margin-bottom: 10px; }
        h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        ul { list-style-type: none; padding-left: 0; }
        li { margin: 8px 0; padding-left: 20px; position: relative; }
        li:before { content: "•"; position: absolute; left: 0; color: #000; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${terms.name}</h1>
        <h2>Beat: "${beatTitle}"</h2>
    </div>

    <div class="section">
        <p><strong>This License Agreement</strong> is made on <strong>${purchaseDate}</strong></p>
        <p><strong>BETWEEN:</strong></p>
        <p><strong>Producer:</strong> ${CONFIG.SENDER_NAME} (${CONFIG.SENDER_EMAIL})</p>
        <p><strong>Licensee:</strong> ${buyerName}</p>
    </div>

    <div class="section highlight">
        <h3>📋 License Terms</h3>
        <ul>
            <li><strong>Streaming Limit:</strong> ${terms.streams || "250,000"} streams</li>
            <li><strong>Digital Sales:</strong> ${terms.sales || "5,000"} downloads/sales</li>
            <li><strong>Music Videos:</strong> ${terms.videos || "2 music videos"}</li>
            <li><strong>Live Performances:</strong> ${terms.performances || "Non-profit performances only"}</li>
            <li><strong>Publishing Rights:</strong> ${terms.publishing || "50%"}</li>
        </ul>
    </div>

    <div class="section">
        <h3>✅ What You CAN Do</h3>
        <ul>
            ${canDoList.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h3>🚫 What You CANNOT Do</h3>
        <ul>
            ${cannotDoList.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h3>💰 Payment Details</h3>
        <p><strong>License Fee:</strong> $${price}</p>
        <p><strong>Purchase Date:</strong> ${purchaseDate}</p>
        <p><strong>License Type:</strong> ${terms.name}</p>
    </div>

    <div class="section">
        <h3>📜 Legal Terms</h3>
        <p>This license is <strong>NON-EXCLUSIVE</strong>. The producer retains full copyright ownership and may license this beat to other artists.</p>
        <p>This license is valid in perpetuity for the specific recording created by the licensee.</p>
        <p>All rights not expressly granted herein are reserved by the producer.</p>
    </div>

    <div class="signature">
        <h3>🔐 Agreement</h3>
        <p>By purchasing this license, ${buyerName} agrees to abide by all terms and conditions outlined in this agreement.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <div>
                <p><strong>Producer:</strong></p>
                <p>_________________________</p>
                <p>${CONFIG.SENDER_NAME}</p>
            </div>
            <div>
                <p><strong>Licensee:</strong></p>
                <p>_________________________</p>
                <p>${buyerName}</p>
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #666;">
        <p>This license was generated automatically on ${purchaseDate}</p>
        <p>For questions, contact: ${CONFIG.SENDER_EMAIL}</p>
    </div>
</body>
</html>
  `;
}

// Default license terms fallback
function getDefaultTerms(licenseType) {
  const defaults = {
    basic: {
      name: "Basic Lease License",
      streams: "250,000",
      sales: "5,000",
      videos: "2 music videos",
      performances: "Non-profit performances only",
      publishing: "50%"
    },
    premium: {
      name: "Premium Lease License",
      streams: "1,000,000",
      sales: "10,000",
      videos: "5 music videos",
      performances: "All performances (commercial allowed)",
      publishing: "75%"
    },
    unlimited: {
      name: "Unlimited Lease License",
      streams: "Unlimited",
      sales: "Unlimited",
      videos: "Unlimited music videos",
      performances: "All performances",
      publishing: "100%"
    }
  };
  
  return defaults[licenseType] || defaults.basic;
}

// Main function to send contract email
function sendContractEmail(buyerName, buyerEmail, beatTitle, licenseType, price, purchaseDate) {
  try {
    // Fetch latest license terms
    if (!licenseTermsCache) {
      fetchLicenseTerms();
    }
    
    // Generate contract HTML
    const contractHTML = generateContractHTML(buyerName, beatTitle, licenseType, purchaseDate, price);
    
    // Create email subject
    const subject = `License Contract: ${beatTitle} - ${licenseType.charAt(0).toUpperCase() + licenseType.slice(1)} License`;
    
    // Send email
    MailApp.sendEmail({
      to: buyerEmail,
      subject: subject,
      htmlBody: contractHTML,
      name: CONFIG.SENDER_NAME
    });
    
    Logger.log(`Contract email sent to ${buyerEmail} for beat: ${beatTitle}`);
    return { success: true, message: "Contract sent successfully" };
    
  } catch (error) {
    Logger.log("Failed to send contract email: " + error.toString());
    return { success: false, error: error.toString() };
  }
}

// Webhook handler function
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Verify this is a Whop webhook
    if (data.type !== "payment.succeeded") {
      return ContentService.createTextOutput("Not a payment webhook");
    }
    
    // Extract payment data
    const payment = data.data;
    const user = payment.user;
    const product = payment.product;
    const membership = payment.membership;
    
    // Extract buyer information
    const buyerName = user?.name || "Valued Customer";
    const buyerEmail = user?.email || "";
    const beatTitle = product?.title || "Beat Purchase";
    const licenseType = extractLicenseType(product?.title || "");
    const price = payment?.final_amount || 0;
    const purchaseDate = new Date().toLocaleDateString();
    
    // Send contract email
    const result = sendContractEmail(buyerName, buyerEmail, beatTitle, licenseType, price, purchaseDate);
    
    // Log the result
    Logger.log("Webhook processed: " + JSON.stringify({
      buyerName,
      buyerEmail,
      beatTitle,
      licenseType,
      price,
      result
    }));
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Contract email sent",
      buyer: buyerName,
      beat: beatTitle,
      licenseType: licenseType
    }));
    
  } catch (error) {
    Logger.log("Webhook error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }));
  }
}

// Test function
function testContractEmail() {
  const testResult = sendContractEmail(
    "John Doe",
    "john@example.com", 
    "Test Beat",
    "basic",
    29.99,
    new Date().toLocaleDateString()
  );
  
  return ContentService.createTextOutput(JSON.stringify(testResult));
}
