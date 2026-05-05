import { NextRequest } from "next/server";
import { getWhopSdk } from "@/lib/whop-sdk";

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG WHOP CONFIG ===');
    
    // Check environment variables
    const config = {
      WHOP_API_KEY: process.env.WHOP_API_KEY ? 'SET' : 'NOT SET',
      WHOP_COMPANY_ID: process.env.WHOP_COMPANY_ID ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_WHOP_APP_ID: process.env.NEXT_PUBLIC_WHOP_APP_ID ? 'SET' : 'NOT SET',
      WHOP_WEBHOOK_SECRET: process.env.WHOP_WEBHOOK_SECRET ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'
    };
    
    console.log('Environment config:', config);
    
    // Test SDK initialization
    const whopsdk = getWhopSdk();
    console.log('SDK initialized successfully');
    
    // Test API call to list products (should work without creating)
    const companyId = process.env.WHOP_COMPANY_ID;
    if (!companyId) {
      return Response.json({ 
        error: "WHOP_COMPANY_ID not configured",
        config 
      }, { status: 500 });
    }
    
    try {
      const products = await whopsdk.products.list({
        company_id: companyId
      });
      
      console.log(`Found ${products.length} existing products`);
      
      return Response.json({ 
        success: true,
        config,
        existingProducts: products.length,
        sampleProduct: products[0] || null
      });
      
    } catch (apiError: any) {
      console.error('API call failed:', apiError);
      return Response.json({ 
        error: "API call failed",
        details: apiError?.message || String(apiError),
        config
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return Response.json({ 
      error: "Debug failed", 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
}
