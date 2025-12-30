import { NextRequest } from "next/server";
import { getWhopSdk } from "@/lib/whop-sdk";

type CreateWhopProductPayload = {
	name?: string;
	price?: number;
	license?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { name, price, license, licenseType, redirectUrl, askQuestions } = await request.json();

    if (!name || typeof name !== "string") {
      return Response.json({ error: "name is required" }, { status: 400 });
    }

    if (typeof price !== "number") {
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

    // Create the product
    const product = await whopsdk.products.create({
      company_id: companyId,
      name: `${name} - ${licenseType.charAt(0).toUpperCase() + licenseType.slice(1)} License`,
      description: license ?? undefined,
      plan_options: {
        plan_type: "one_time",
        base_currency: "usd",
        initial_price: Math.ceil(price * 100), // Price should be in cents
      },
    });

    // Get the plans from the product to get the purchase_url
    const plans = await whopsdk.plans.list({ company_id: companyId, product_ids: [product.id] });
    const firstPlan = plans.data?.[0];

    // Update product with redirect URL and questions if provided
    if (redirectUrl || askQuestions) {
      const updateData: any = {};
      
      if (redirectUrl) {
        updateData.redirect_after_checkout = redirectUrl;
      }
      
      if (askQuestions) {
        updateData.require_questions = true;
        // Add default questions for buyer info
        updateData.questions = [
          {
            question: "Full Name",
            required: true,
            type: "text"
          },
          {
            question: "Email",
            required: true,
            type: "email"
          }
        ];
      }

      await whopsdk.products.update({
        company_id: companyId,
        product_id: product.id,
        ...updateData
      });
    }
    
    return Response.json({ 
      success: true, 
      id: product.id, 
      product,
      purchase_url: firstPlan?.purchase_url,
    });

  } catch (error: any) {
    const message = typeof error?.message === "string" ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
