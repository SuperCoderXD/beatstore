import { NextRequest } from "next/server";

// Inkless API configuration
const INKLESS_API_URL = "https://api.useinkless.com";
const INKLESS_API_KEY = process.env.INKLESS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { contractData, licenseTerms } = await request.json();

    if (!INKLESS_API_KEY) {
      return Response.json({ 
        error: "Inkless API key not configured" 
      }, { status: 500 });
    }

    const { beat, license, price, name, email, transactionId, date, producerName, producerEmail } = contractData;
    const currentTerms = licenseTerms?.[license as keyof typeof licenseTerms] || licenseTerms?.basic;

    // Create HTML contract content
    const contractHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Beat License Agreement - ${beat}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 50px auto; 
            padding: 20px; 
            line-height: 1.6; 
            color: #333;
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
          }
          .signature-area { 
            margin-top: 50px; 
            padding: 30px; 
            border: 2px dashed #ccc; 
            text-align: center;
          }
          h1 { color: #000; margin-bottom: 10px; }
          h2 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .can-do { color: #28a745; }
          .cannot-do { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BEAT LICENSE AGREEMENT</h1>
          <p><strong>Non-Exclusive License Contract</strong></p>
          <p><em>Beat: "${beat}" - ${license.charAt(0).toUpperCase() + license.slice(1)} License</em></p>
        </div>

        <div class="section">
          <h2>Transaction Details</h2>
          <div class="grid">
            <div>
              <p><strong>Transaction ID:</strong> ${transactionId || 'N/A'}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Beat Title:</strong> ${beat}</p>
            </div>
            <div>
              <p><strong>License Type:</strong> ${license.charAt(0).toUpperCase() + license.slice(1)}</p>
              <p><strong>License Fee:</strong> $${price}</p>
              <p><strong>Licensee:</strong> ${name}</p>
            </div>
          </div>
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
          <h2 class="can-do">✅ What You CAN Do</h2>
          <ul>
            ${currentTerms?.canDo?.map((item: string) => `<li>${item}</li>`).join('') || '<li>Use the beat for commercial projects</li>'}
          </ul>
        </div>

        <div class="section">
          <h2 class="cannot-do">🚫 What You CANNOT Do</h2>
          <ul>
            ${currentTerms?.cannotDo?.map((item: string) => `<li>${item}</li>`).join('') || '<li>Resell the beat as your own</li>'}
          </ul>
        </div>

        <div class="section">
          <h2>Agreement</h2>
          <p>By signing this contract, ${name} agrees to abide by all terms and conditions outlined above. 
          This license grants the rights specified in the "What You CAN Do" section, 
          subject to the restrictions in the "What You CANNOT Do" section. 
          Violation of these terms may result in legal action and termination of this license.</p>
          
          <p>This license is effective as of ${date} and remains in effect perpetually unless terminated due to breach of terms.</p>
        </div>

        <div class="signature-area">
          <h3>Signature Required</h3>
          <p>Please sign below to accept these terms:</p>
        </div>
      </body>
      </html>
    `;

    // First, create a template in Inkless
    const templateResponse = await fetch(`${INKLESS_API_URL}/createNewTemplate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INKLESS_API_KEY
      },
      body: JSON.stringify({
        name: `${beat} - ${license.charAt(0).toUpperCase() + license.slice(1)} License Template`,
        content: contractHTML,
        description: `Beat license agreement for ${beat} - ${license} license`
      })
    });

    if (!templateResponse.ok) {
      const errorData = await templateResponse.text();
      console.error('Inkless Template API Error:', errorData);
      throw new Error('Failed to create template with Inkless');
    }

    const templateData = await templateResponse.json();

    // Then create a document from the template
    const documentResponse = await fetch(`${INKLESS_API_URL}/createFromTemplate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INKLESS_API_KEY
      },
      body: JSON.stringify({
        templateId: templateData.templateId,
        recipients: [{
          email: email,
          name: name
        }],
        metadata: {
          beat_title: beat,
          license_type: license,
          transaction_id: transactionId,
          license_fee: price,
          contract_date: date
        }
      })
    });

    if (!documentResponse.ok) {
      const errorData = await documentResponse.text();
      console.error('Inkless Document API Error:', errorData);
      throw new Error('Failed to create document with Inkless');
    }

    const documentData = await documentResponse.json();

    return Response.json({
      success: true,
      documentId: documentData.documentId,
      templateId: templateData.templateId,
      signingUrl: documentData.signingUrl || `https://app.useinkless.com/sign/${documentData.documentId}`,
      message: "Contract created and sent for signing via Inkless"
    });

  } catch (error: any) {
    console.error('Contract creation error:', error);
    return Response.json({ 
      error: error.message || "Failed to create contract document" 
    }, { status: 500 });
  }
}
