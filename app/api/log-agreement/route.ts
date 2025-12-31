import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const agreementData = await request.json();

    // Log the agreement for your records
    console.log('License Agreement Submitted:', {
      ...agreementData,
      timestamp: new Date().toISOString()
    });

    // Send email via Gmail SMTP
    let emailSent = false;
    if (agreementData.email) {
      try {
        const htmlContent = generateAgreementHTML(agreementData);
        await sendGmailEmail(agreementData.email, `Beat License Agreement - ${agreementData.beat}`, htmlContent);
        console.log(`✅ Email sent to: ${agreementData.email}`);
        emailSent = true;
      } catch (emailError) {
        console.error('Failed to send email via Gmail SMTP:', emailError);
      }
    }

    // Optional: Send notification to producer
    if (agreementData.agreed && process.env.PRODUCER_EMAIL) {
      try {
        const notificationBody = `
Great news! ${agreementData.name} has agreed to the license terms for "${agreementData.beat}".

Details:
• License Type: ${agreementData.license.charAt(0).toUpperCase() + agreementData.license.slice(1)}
• Price: $${agreementData.price}
• Customer Email: ${agreementData.email}
• Transaction ID: ${agreementData.transactionId || 'N/A'}
• Date: ${new Date().toLocaleDateString()}

Customer can now use the beat for profit use according to the license terms.
        `;
        await sendGmailEmail(process.env.PRODUCER_EMAIL, `✅ New Agreement Signed - ${agreementData.beat}`, notificationBody);
      } catch (notificationError) {
        console.error('Failed to send producer notification:', notificationError);
      }
    }

    return Response.json({
      success: true,
      message: emailSent 
        ? "Agreement recorded and email sent successfully"
        : "Agreement recorded successfully (email service not configured)",
      agreed: agreementData.agreed,
      emailSent: emailSent
    });

  } catch (error: any) {
    console.error('Error logging agreement:', error);
    return Response.json({ 
      error: error.message || "Failed to record agreement" 
    }, { status: 500 });
  }
}

async function sendGmailEmail(to: string, subject: string, body: string) {
  const nodemailer = await import('nodemailer');
  
  // Create transporter with Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Send email
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: to,
    subject: subject,
    html: body
  });
}

function generateAgreementHTML(data: any) {
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
    <div class="logo">${producerName || 'Beat Store'}</div>
    
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
      ${producerName || 'Producer'}<br>
      ${producerEmail || 'producer@example.com'}</p>
      
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
      <p>For questions, contact: ${producerEmail || 'producer@example.com'}</p>
    </div>
  </div>
</body>
</html>
  `;
}
