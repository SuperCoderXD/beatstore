import { NextRequest } from "next/server";
import { getWhopSdk } from "@/lib/whop-sdk";
import { deleteBeat as deleteBeatFromDB, BeatRecord } from "@/lib/mongodb";

async function deleteWhopProduct(productId: string): Promise<boolean> {
  try {
    const whopsdk = getWhopSdk();
    await whopsdk.products.delete(productId);
    return true;
  } catch (error: any) {
    console.error(`Failed to delete Whop product ${productId}:`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { beatId, whopProductIds } = await request.json();

    if (!beatId || typeof beatId !== "string") {
      return Response.json({ error: "beatId is required" }, { status: 400 });
    }

    if (!whopProductIds || typeof whopProductIds !== "object") {
      return Response.json({ error: "whopProductIds is required" }, { status: 400 });
    }

    // Attempt to delete Whop products
    const deletedProducts: string[] = [];
    const productIds = [
      whopProductIds.basic,
      whopProductIds.premium,
      whopProductIds.unlimited
    ];

    for (const productId of productIds) {
      if (productId && productId !== "") {
        const deleted = await deleteWhopProduct(productId);
        if (deleted) {
          deletedProducts.push(productId);
        }
      }
    }

    // Delete beat from MongoDB
    await deleteBeatFromDB(beatId);

    return Response.json({ 
      success: true, 
      message: "Beat deleted successfully from MongoDB and Whop products",
      deletedProducts,
      deletedProductsCount: deletedProducts.length
    });

  } catch (error: any) {
    console.error("Failed to delete beat:", error);
    return Response.json({ 
      error: error.message || "Failed to delete beat" 
    }, { status: 500 });
  }
}
