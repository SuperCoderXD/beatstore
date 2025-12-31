import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const agreementData = await request.json();

    // Log the agreement for your records
    console.log('License Agreement Submitted:', {
      ...agreementData,
      timestamp: new Date().toISOString()
    });

    // You could also save this to a database, send an email, etc.
    // For now, we'll just log it and return success
    
    // Optional: Send email notification to producer
    if (agreementData.agreed && agreementData.producerEmail) {
      console.log(`✅ AGREEMENT: ${agreementData.name} agreed to ${agreementData.license} license for "${agreementData.beat}"`);
      // You could integrate with an email service here
    } else if (!agreementData.agreed) {
      console.log(`❌ DISAGREEMENT: ${agreementData.name} declined terms for "${agreementData.beat}"`);
    }

    return Response.json({
      success: true,
      message: "Agreement recorded successfully",
      agreed: agreementData.agreed
    });

  } catch (error: any) {
    console.error('Error logging agreement:', error);
    return Response.json({ 
      error: error.message || "Failed to record agreement" 
    }, { status: 500 });
  }
}
