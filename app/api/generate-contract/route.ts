import { NextRequest } from "next/server";

interface ContractData {
  buyerName: string;
  beatTitle: string;
  licenseType: string;
  price: number;
  purchaseDate: string;
  producerName: string;
  producerEmail: string;
}

const generateContractHTML = async (data: ContractData): Promise<string> => {
  // Fetch license terms from API
  let licenseTerms;
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/license-terms`);
    const termsData = await response.json();
    licenseTerms = termsData.success ? termsData.terms : null;
  } catch (error) {
    console.error('Failed to fetch license terms:', error);
    licenseTerms = null;
  }

  // Fallback to default terms if API fails
  const defaultTerms = {
    basic: {
      name: "Basic Lease License",
      streams: "250,000",
      sales: "5,000",
      videos: "2 music videos",
      performances: "Non-profit performances only",
      publishing: "50%"
    },
    premium: {
      name: "Premium Lease License", 
      streams: "1,000,000",
      sales: "10,000",
      videos: "5 music videos",
      performances: "All performances (commercial allowed)",
      publishing: "75%"
    },
    unlimited: {
      name: "Unlimited Lease License",
      streams: "Unlimited",
      sales: "Unlimited", 
      videos: "Unlimited music videos",
      performances: "All performances",
      publishing: "100%"
    }
  };

  const terms = licenseTerms?.[data.licenseType as keyof typeof licenseTerms] || 
                defaultTerms[data.licenseType as keyof typeof defaultTerms];

  const canDoList = licenseTerms?.[data.licenseType as keyof typeof licenseTerms]?.canDo || [
    "Use the beat for your recording, mix, and master",
    "Distribute your song on Spotify, Apple Music, etc.",
    "Use for music videos within the limits above",
    "Perform live (subject to terms above)",
    "Keep 100% of master recording royalties"
  ];

  const cannotDoList = licenseTerms?.[data.licenseType as keyof typeof licenseTerms]?.cannotDo || [
    "Transfer or resell this license to another artist",
    "Register the beat with Content ID as your own",
    "Claim copyright ownership of the underlying beat",
    "Use the beat in film/TV without additional license",
    "Create derivative beats from this instrumental"
  ];

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${terms.name} - ${data.beatTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 20px 0; }
        .signature { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; }
        .highlight { background-color: #f0f0f0; padding: 10px; border-left: 4px solid #000; }
        h1 { color: #000; margin-bottom: 10px; }
        h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        ul { list-style-type: none; padding-left: 0; }
        li { margin: 8px 0; padding-left: 20px; position: relative; }
        li:before { content: "•"; position: absolute; left: 0; color: #000; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${terms.name}</h1>
        <h2>Beat: "${data.beatTitle}"</h2>
    </div>

    <div class="section">
        <p><strong>This License Agreement</strong> is made on <strong>${data.purchaseDate}</strong></p>
        <p><strong>BETWEEN:</strong></p>
        <p><strong>Producer:</strong> ${data.producerName} (${data.producerEmail})</p>
        <p><strong>Licensee:</strong> ${data.buyerName}</p>
    </div>

    <div class="section highlight">
        <h3>📋 License Terms</h3>
        <ul>
            <li><strong>Streaming Limit:</strong> ${terms.streams} streams</li>
            <li><strong>Digital Sales:</strong> ${terms.sales} downloads/sales</li>
            <li><strong>Music Videos:</strong> ${terms.videos}</li>
            <li><strong>Live Performances:</strong> ${terms.performances}</li>
            <li><strong>Publishing Rights:</strong> ${terms.publishing}</li>
        </ul>
    </div>

    <div class="section">
        <h3>✅ What You CAN Do</h3>
        <ul>
            ${canDoList.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h3>🚫 What You CANNOT Do</h3>
        <ul>
            ${cannotDoList.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h3>💰 Payment Details</h3>
        <p><strong>License Fee:</strong> $${data.price}</p>
        <p><strong>Purchase Date:</strong> ${data.purchaseDate}</p>
        <p><strong>License Type:</strong> ${terms.name}</p>
    </div>

    <div class="section">
        <h3>📜 Legal Terms</h3>
        <p>This license is <strong>NON-EXCLUSIVE</strong>. The producer retains full copyright ownership and may license this beat to other artists.</p>
        <p>This license is valid in perpetuity for the specific recording created by the licensee.</p>
        <p>All rights not expressly granted herein are reserved by the producer.</p>
    </div>

    <div class="signature">
        <h3>🔐 Agreement</h3>
        <p>By purchasing this license, ${data.buyerName} agrees to abide by all terms and conditions outlined in this agreement.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <div>
                <p><strong>Producer:</strong></p>
                <p>_________________________</p>
                <p>${data.producerName}</p>
            </div>
            <div>
                <p><strong>Licensee:</strong></p>
                <p>_________________________</p>
                <p>${data.buyerName}</p>
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #666;">
        <p>This license was generated automatically on ${data.purchaseDate}</p>
        <p>For questions, contact: ${data.producerEmail}</p>
    </div>
</body>
</html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const contractData: ContractData = await request.json();

    // Validate required fields
    if (!contractData.buyerName || !contractData.beatTitle || !contractData.licenseType) {
      return Response.json({ 
        error: "Missing required fields: buyerName, beatTitle, licenseType" 
      }, { status: 400 });
    }

    // Generate HTML contract
    const contractHTML = await generateContractHTML(contractData);

    // In a real implementation, you would:
    // 1. Convert HTML to PDF using a service like Puppeteer
    // 2. Store the PDF somewhere (AWS S3, etc.)
    // 3. Return the PDF URL
    
    // For now, return the HTML which can be saved as PDF
    return Response.json({
      success: true,
      contractHTML,
      fileName: `${contractData.beatTitle}_${contractData.licenseType}_License.html`
    });

  } catch (error: any) {
    console.error("Contract generation error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
