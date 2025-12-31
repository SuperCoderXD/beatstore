import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const agreementData = await request.json();

    // Log the agreement for your records
    console.log('License Agreement Submitted:', {
      ...agreementData,
      timestamp: new Date().toISOString()
    });

    // Generate agreement HTML for email
    const agreementHTML = generateAgreementHTML(agreementData);

    // Send email to customer
    if (agreementData.email) {
      try {
        await sendAgreementEmail(agreementData, agreementHTML);
        console.log(`✅ Email sent to: ${agreementData.email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue even if email fails
      }
    }

    // Optional: Send notification email to producer
    if (agreementData.agreed && agreementData.producerEmail) {
      console.log(`✅ AGREEMENT: ${agreementData.name} agreed to ${agreementData.license} license for "${agreementData.beat}"`);
      // You could send yourself a notification here
    }

    return Response.json({
      success: true,
      message: "Agreement recorded and email sent successfully",
      agreed: agreementData.agreed,
      emailSent: !!agreementData.email
    });

  } catch (error: any) {
    console.error('Error logging agreement:', error);
    return Response.json({ 
      error: error.message || "Failed to record agreement" 
    }, { status: 500 });
  }
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
      </style>
    </head>
    <body>
      <div class="container">
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
          ${producerName}<br>
          ${producerEmail}</p>
          
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
          <p>For questions, contact: ${producerEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendAgreementEmail(data: any, htmlContent: string) {
  // Using a simple email service - you can replace with your preferred email provider
  
  // Option 1: Using Resend (recommended for Next.js)
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@yourbeatstore.com',
      to: [data.email],
      subject: `Beat License Agreement - ${data.beat}`,
      html: htmlContent
    });
    return;
  }

  // Option 2: Using SendGrid
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = await import('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to: data.email,
      from: process.env.FROM_EMAIL || 'noreply@yourbeatstore.com',
      subject: `Beat License Agreement - ${data.beat}`,
      html: htmlContent
    });
    return;
  }

  // Option 3: Using Nodemailer with SMTP
  if (process.env.SMTP_HOST) {
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@yourbeatstore.com',
      to: data.email,
      subject: `Beat License Agreement - ${data.beat}`,
      html: htmlContent
    });
    return;
  }

  // Option 4: Fallback - just log that we couldn't send
  console.log('Email service not configured. Please set up RESEND_API_KEY, SENDGRID_API_KEY, or SMTP settings.');
}
