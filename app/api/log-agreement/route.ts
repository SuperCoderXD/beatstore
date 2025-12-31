import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const agreementData = await request.json();

    // Log the agreement for your records
    console.log('License Agreement Submitted:', {
      ...agreementData,
      timestamp: new Date().toISOString()
    });

    // Send email via Google Apps Script
    let emailSent = false;
    if (agreementData.email && process.env.GOOGLE_SCRIPT_URL) {
      try {
        const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(agreementData)
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Google Apps Script response:', result);
          emailSent = true;
        } else {
          console.error('Google Apps Script error:', await response.text());
        }
      } catch (emailError) {
        console.error('Failed to send email via Google Apps Script:', emailError);
      }
    }

    // Optional: Send notification email to producer
    if (agreementData.agreed && agreementData.producerEmail) {
      console.log(`✅ AGREEMENT: ${agreementData.name} agreed to ${agreementData.license} license for "${agreementData.beat}"`);
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
