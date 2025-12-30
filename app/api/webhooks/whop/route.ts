import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    
    console.log('Whop webhook received:', webhookData);
    
    // Verify this is a payment succeeded webhook
    if (webhookData.type !== "payment.succeeded") {
      return Response.json({ 
        error: "Invalid webhook type" 
      }, { status: 400 });
    }

    // Extract payment data
    const payment = webhookData.data;
    const user = payment.user;
    const product = payment.product;
    const membership = payment.membership;
    
    // Extract buyer information
    const buyerName = user?.name || "Valued Customer";
    const buyerEmail = user?.email || "";
    const beatTitle = product?.title || "Beat Purchase";
    const price = payment?.final_amount || 0;
    const purchaseDate = new Date().toISOString();
    
    // Determine license type from product title
    const licenseType = (() => {
      const title = (product?.title || "").toLowerCase();
      if (title.includes("basic")) return "basic";
      if (title.includes("premium")) return "premium";
      if (title.includes("unlimited")) return "unlimited";
      return "basic";
    })();

    // Log the webhook data
    console.log('Payment details:', {
      buyerName,
      buyerEmail,
      beatTitle,
      licenseType,
      price,
      purchaseDate
    });

    // Trigger Google Apps Script to send contract email
    try {
      const scriptUrl = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`;
      
      const scriptPayload = {
        functionName: "sendContractEmail",
        parameters: {
          buyerName,
          buyerEmail,
          beatTitle,
          licenseType,
          price,
          purchaseDate
        }
      };

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GOOGLE_APPS_SCRIPT_TOKEN}`
        },
        body: JSON.stringify(scriptPayload)
      });

      const result = await response.json();
      console.log('Google Apps Script result:', result);

      return Response.json({
        success: true,
        message: "Contract email sent via Google Apps Script",
        webhookData: {
          buyerName,
          buyerEmail,
          beatTitle,
          licenseType,
          price,
          purchaseDate
        }
      });

    } catch (error) {
      console.error('Failed to trigger Google Apps Script:', error);
      
      // Fallback: Send to your own contract generator
      try {
        const contractResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/generate-contract`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            buyerName,
            beatTitle,
            licenseType,
            price,
            purchaseDate,
            producerName: "Your Name",
            producerEmail: "your-email@example.com"
          })
        });

        const contractData = await contractResponse.json();
        
        if (contractData.success) {
          console.log('Contract generated locally:', contractData.fileName);
          
          // Here you could also store the contract and send via your own email service
          // For now, just log that it was generated
          return Response.json({
            success: true,
            message: "Contract generated (email service unavailable)",
            contractUrl: `data:text/html;charset=utf-8,${encodeURIComponent(contractData.contractHTML)}`
          });
        }
      } catch (fallbackError) {
        console.error('Fallback contract generation failed:', fallbackError);
      }
    }

    return Response.json({
      error: "Failed to process webhook",
      webhookData
    }, { status: 500 });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
