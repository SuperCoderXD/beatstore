// Google Apps Script for sending agreement emails
// Deploy as Web App: https://script.google.com/home

// Configuration - Update these values
const CONFIG = {
  // Your email address (as sender)
  SENDER_EMAIL: "your-email@gmail.com",
  
  // Your producer name
  PRODUCER_NAME: "Your Producer Name",
  
  // Your website domain
  WEBSITE_DOMAIN: "yourbeatstore.com"
};

// Web app endpoint - this function handles POST requests
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log("Agreement data received:", data);
    
    // Send agreement email to customer
    const result = sendAgreementEmail(data);
    
    // Send notification to producer (optional)
    if (data.agreed) {
      sendProducerNotification(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Agreement email sent successfully",
      result: result
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error("Error processing agreement:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Send agreement email to customer
function sendAgreementEmail(data) {
  const { beat, license, price, name, email, date, agreed, transactionId } = data;
  
  const subject = `Beat License Agreement - ${beat}`;
  const htmlBody = generateAgreementHTML(data);
  
  // Send email using GmailApp
  const options = {
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: CONFIG.PRODUCER_NAME,
    replyTo: CONFIG.SENDER_EMAIL
  };
  
  GmailApp.sendEmail(options);
  console.log(`Agreement email sent to: ${email}`);
  
  return {
    to: email,
    subject: subject,
    sent: new Date().toISOString()
  };
}

// Send notification to producer
function sendProducerNotification(data) {
  const { beat, license, price, name, email, agreed, transactionId } = data;
  
  const subject = `✅ New Agreement Signed - ${beat}`;
  const body = `
Great news! ${name} has agreed to the license terms for "${beat}".

Details:
• License Type: ${license.charAt(0).toUpperCase() + license.slice(1)}
• Price: $${price}
• Customer Email: ${email}
• Transaction ID: ${transactionId || 'N/A'}
• Date: ${new Date().toLocaleDateString()}

Customer can now use the beat for profit use according to the license terms.

Keep this email for your records.
  `;
  
  GmailApp.sendEmail(CONFIG.SENDER_EMAIL, subject, body);
  console.log(`Producer notification sent for: ${beat}`);
}

// Generate professional HTML email content
function generateAgreementHTML(data) {
  const { beat, license, price, name, email, date, producerName, producerEmail, agreed, transactionId } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beat License Agreement - ${beat}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px; 
      line-height: 1.6; 
      color: #333;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header { 
      text-align: center; 
      border-bottom: 3px solid #000; 
      padding-bottom: 20px; 
      margin-bottom: 30px;
    }
    .section { 
      margin: 30px 0; 
      padding: 20px; 
      border: 1px solid #ddd; 
      border-radius: 8px;
      background-color: #fafafa;
    }
    .agreed { background-color: #d4edda; border-color: #c3e6cb; }
    .disagreed { background-color: #f8d7da; border-color: #f5c6cb; }
    h1 { color: #000; margin-bottom: 10px; }
    h2 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .status { font-size: 18px; font-weight: bold; padding: 10px; border-radius: 5px; text-align: center; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    .logo { font-size: 24px; font-weight: bold; color: #000; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">${CONFIG.PRODUCER_NAME}</div>
    
    <div class="header">
      <h1>BEAT LICENSE AGREEMENT</h1>
      <p><strong>Non-Exclusive License Terms</strong></p>
      <p><em>Beat: "${beat}" - ${license.charAt(0).toUpperCase() + license.slice(1)} License</em></p>
    </div>

    <div class="section ${agreed ? 'agreed' : 'disagreed'}">
      <div class="status">
        ${agreed ? '✅ AGREEMENT ACCEPTED' : '❌ AGREEMENT DECLINED'}
      </div>
      <p><strong>Your Decision:</strong> ${agreed 
        ? 'You have agreed to the license terms and can use the beat for profit use according to the license limitations.'
        : 'You have declined the license terms and will not use the beat for profit use.'
      }</p>
    </div>

    <div class="section">
      <h2>License Details</h2>
      <p><strong>Beat Title:</strong> ${beat}</p>
      <p><strong>License Type:</strong> ${license.charAt(0).toUpperCase() + license.slice(1)}</p>
      <p><strong>License Fee:</strong> $${price}</p>
      <p><strong>Agreement Date:</strong> ${date}</p>
      <p><strong>Transaction ID:</strong> ${transactionId || 'N/A'}</p>
    </div>

    <div class="section">
      <h2>Parties</h2>
      <p><strong>Licensor (Producer):</strong><br>
      ${CONFIG.PRODUCER_NAME}<br>
      ${CONFIG.SENDER_EMAIL}</p>
      
      <p><strong>Licensee (Artist):</strong><br>
      ${name}<br>
      ${email}</p>
    </div>

    <div class="section">
      <h2>Important Notice</h2>
      <p><strong>By using the following beat for profit use, you agree to the following terms:</strong></p>
      <ul>
        <li>I (the producer) keep the rights to the instrumental</li>
        <li>Other artists may also be licensed to use this beat</li>
        <li>There are specific limitations based on your license type</li>
        <li>You must abide by all terms outlined in your ${license} license</li>
      </ul>
    </div>

    <div class="footer">
      <p>This agreement was generated and recorded on ${date}</p>
      <p>Please keep this email for your records.</p>
      <p>For questions, contact: ${CONFIG.SENDER_EMAIL}</p>
      <p>Visit our store: <a href="https://${CONFIG.WEBSITE_DOMAIN}">${CONFIG.WEBSITE_DOMAIN}</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// Test function - run this to test the email sending
function testAgreementEmail() {
  const testData = {
    beat: "Test Beat",
    license: "basic",
    price: "29.99",
    name: "Test Customer",
    email: CONFIG.SENDER_EMAIL, // Send to yourself for testing
    date: new Date().toLocaleDateString(),
    agreed: true,
    transactionId: "TEST_123",
    producerName: CONFIG.PRODUCER_NAME,
    producerEmail: CONFIG.SENDER_EMAIL
  };
  
  const result = sendAgreementEmail(testData);
  console.log("Test result:", result);
}

// Deploy instructions:
// 1. Open https://script.google.com/home
// 2. Click "New Project"
// 3. Paste this code
// 4. Update CONFIG values at the top
// 5. Save project (Ctrl+S)
// 6. Click "Deploy" > "New deployment"
// 7. Choose "Web app"
// 8. Execute as: "Me"
// 9. Who has access: "Anyone"
// 10. Click "Deploy"
// 11. Copy the Web app URL
// 12. Add URL to your Vercel environment as GOOGLE_SCRIPT_URL
