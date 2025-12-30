import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface LicenseTerms {
  basic: {
    name: string;
    streams: string;
    sales: string;
    videos: string;
    performances: string;
    publishing: string;
    description: string;
    canDo: string[];
    cannotDo: string[];
  };
  premium: {
    name: string;
    streams: string;
    sales: string;
    videos: string;
    performances: string;
    publishing: string;
    description: string;
    canDo: string[];
    cannotDo: string[];
  };
  unlimited: {
    name: string;
    streams: string;
    sales: string;
    videos: string;
    performances: string;
    publishing: string;
    description: string;
    canDo: string[];
    cannotDo: string[];
  };
}

const defaultTerms: LicenseTerms = {
  basic: {
    name: "Basic Lease License",
    streams: "250,000",
    sales: "5,000",
    videos: "2 music videos",
    performances: "Non-profit performances only",
    publishing: "50%",
    description: "Perfect for artists starting out or working on smaller projects.",
    canDo: [
      "Use the beat for your recording, mix, and master",
      "Distribute your song on Spotify, Apple Music, etc.",
      "Use for 2 music videos",
      "Perform live at non-profit events",
      "Keep 100% of master recording royalties"
    ],
    cannotDo: [
      "Transfer or resell this license to another artist",
      "Register the beat with Content ID as your own",
      "Claim copyright ownership of the underlying beat",
      "Use for commercial performances",
      "Create derivative beats from this instrumental"
    ]
  },
  premium: {
    name: "Premium Lease License",
    streams: "1,000,000",
    sales: "10,000",
    videos: "5 music videos",
    performances: "All performances (commercial allowed)",
    publishing: "75%",
    description: "Great for established artists and commercial projects.",
    canDo: [
      "Use the beat for your recording, mix, and master",
      "Distribute your song on Spotify, Apple Music, etc.",
      "Use for 5 music videos",
      "Perform live commercially",
      "Keep 100% of master recording royalties"
    ],
    cannotDo: [
      "Transfer or resell this license to another artist",
      "Register the beat with Content ID as your own",
      "Claim copyright ownership of the underlying beat",
      "Use in film/TV without additional license",
      "Create derivative beats from this instrumental"
    ]
  },
  unlimited: {
    name: "Unlimited Lease License",
    streams: "Unlimited",
    sales: "Unlimited",
    videos: "Unlimited music videos",
    performances: "All performances",
    publishing: "100%",
    description: "Maximum rights for serious artists and major projects.",
    canDo: [
      "Use the beat for your recording, mix, and master",
      "Distribute your song with unlimited streams",
      "Unlimited music videos",
      "All live performances",
      "Keep 100% of master recording royalties",
      "Use in commercial projects"
    ],
    cannotDo: [
      "Transfer or resell this license to another artist",
      "Register the beat with Content ID as your own",
      "Claim copyright ownership of the underlying beat",
      "Create derivative beats from this instrumental"
    ]
  }
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "license-terms.json");

export async function GET() {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const terms = JSON.parse(raw);
    return Response.json({ success: true, terms });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // Return default terms if file doesn't exist
      return Response.json({ success: true, terms: defaultTerms });
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const terms: LicenseTerms = await request.json();

    // Validate the structure
    if (!terms.basic || !terms.premium || !terms.unlimited) {
      return Response.json({ 
        error: "Invalid license terms structure. Must include basic, premium, and unlimited." 
      }, { status: 400 });
    }

    // Validate required fields for each license type
    const requiredFields = ['name', 'streams', 'sales', 'videos', 'performances', 'publishing', 'description', 'canDo', 'cannotDo'];
    
    for (const licenseType of ['basic', 'premium', 'unlimited'] as const) {
      for (const field of requiredFields) {
        if (!(field in terms[licenseType])) {
          return Response.json({ 
            error: `Missing required field '${field}' for ${licenseType} license` 
          }, { status: 400 });
        }
      }
    }

    // Save to file
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(terms, null, 2), "utf8");

    return Response.json({ 
      success: true, 
      message: "License terms saved successfully" 
    });

  } catch (error: any) {
    console.error("Error saving license terms:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
