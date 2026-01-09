import { NextRequest } from "next/server";
import { getWhopSdk } from "@/lib/whop-sdk";

type CreateWhopProductPayload = {
	name?: string;
	price?: number;
	license?: string;
};

export async function POST(request: NextRequest) {
  console.log('=== CREATE WHOP PRODUCT API CALLED ===');
  
  try {
    const { name, price, license, licenseType, redirectUrl, askQuestions } = await request.json();
    
    console.log('Received data:', { name, price, license, licenseType, redirectUrl, askQuestions });

    if (!name || typeof name !== "string") {
      return Response.json({ error: "name is required" }, { status: 400 });
    }

    // Convert price to number if it's a string
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    
    if (typeof numericPrice !== "number" || isNaN(numericPrice)) {
      return Response.json({ error: "price is required as number" }, { status: 400 });
    }

    if (!licenseType || typeof licenseType !== "string") {
      return Response.json({ error: "licenseType is required" }, { status: 400 });
    }

    const whopsdk = getWhopSdk();

    // Get company ID from environment
    const companyId = process.env.WHOP_COMPANY_ID;
    if (!companyId) {
      return Response.json({ error: "WHOP_COMPANY_ID not configured" }, { status: 500 });
    }

    // Create the product using the correct SDK parameters
    // Truncate name to fit within 40 character limit for title
    const shortName = name.length > 20 ? name.substring(0, 20) + "..." : name;
    const product = await whopsdk.products.create({
      company_id: companyId,
      title: `${shortName} - ${licenseType}`,
      description: license ?? undefined,
    });

    // Explicitly create a one-time plan with price (Whop UI hides pricing if no plan)
    const plan = await whopsdk.plans.create({
      company_id: companyId,
      product_id: product.id,
      plan_type: "one_time",
      initial_price: numericPrice, // dollars - not cents
    });

    console.log('Created product:', product);
    console.log('Created plan:', plan);
    
    return Response.json({ 
      success: true, 
      id: product.id, 
      product,
      purchase_url: plan?.purchase_url,
      plan,
    });

  } catch (error: any) {
    console.log('=== WHOP API ERROR ===');
    console.log('Error:', error);
    console.log('Error message:', error?.message);
    console.log('Error details:', error?.response?.data || error?.data);
    
    const message = typeof error?.message === "string" ? error.message : "Unknown error";
    return Response.json({ error: message, details: error?.response?.data || error?.data }, { status: 500 });
  }
}
