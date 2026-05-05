import { generateWhopProductData } from './whop-product-generator';

interface BeatRecord {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  slug?: string;
  whopProductIds: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  prices: {
    basic: number;
    premium: number;
    unlimited: number;
  };
  licenses: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  assets: {
    basicFiles: string[];
    premiumFiles: string[];
    unlimitedFiles: string[];
  };
  createdAt: string;
  listed?: boolean;
}

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

interface BeatContentData {
  beatId: string;
  beatTitle: string;
  basic: {
    title: string;
    headline: string;
    description: string;
  };
  premium: {
    title: string;
    headline: string;
    description: string;
  };
  unlimited: {
    title: string;
    headline: string;
    description: string;
  };
}

export async function generateContentForBeats(beats: BeatRecord[]): Promise<BeatContentData[]> {
  // Fetch current license terms
  let licenseTerms: LicenseTerms;
  try {
    const response = await fetch('/api/license-terms');
    if (response.ok) {
      const data = await response.json();
      licenseTerms = data.terms;
    } else {
      throw new Error('Failed to fetch license terms');
    }
  } catch (error) {
    console.error('Error fetching license terms:', error);
    // Use default terms as fallback
    licenseTerms = getDefaultLicenseTerms();
  }

  return beats.map(beat => {
    const basic = generateWhopProductData(beat.title, 'basic', licenseTerms);
    const premium = generateWhopProductData(beat.title, 'premium', licenseTerms);
    const unlimited = generateWhopProductData(beat.title, 'unlimited', licenseTerms);

    return {
      beatId: beat.id,
      beatTitle: beat.title,
      basic: {
        title: basic.title,
        headline: basic.headline,
        description: basic.description
      },
      premium: {
        title: premium.title,
        headline: premium.headline,
        description: premium.description
      },
      unlimited: {
        title: unlimited.title,
        headline: unlimited.headline,
        description: unlimited.description
      }
    };
  });
}

function getDefaultLicenseTerms(): LicenseTerms {
  return {
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
}

export function formatContentForCopyPaste(contentData: BeatContentData): string {
  const sections = [
    `=== ${contentData.beatTitle} ===`,
    '',
    '--- BASIC LICENSE ---',
    `Title: ${contentData.basic.title}`,
    `Headline: ${contentData.basic.headline}`,
    `Description: ${contentData.basic.description}`,
    '',
    '--- PREMIUM LICENSE ---',
    `Title: ${contentData.premium.title}`,
    `Headline: ${contentData.premium.headline}`,
    `Description: ${contentData.premium.description}`,
    '',
    '--- UNLIMITED LICENSE ---',
    `Title: ${contentData.unlimited.title}`,
    `Headline: ${contentData.unlimited.headline}`,
    `Description: ${contentData.unlimited.description}`,
    '',
    '='.repeat(80),
    ''
  ];

  return sections.join('\n');
}

export function formatAllBeatsForCopyPaste(beatsContent: BeatContentData[]): string {
  return beatsContent.map(beat => formatContentForCopyPaste(beat)).join('\n');
}
