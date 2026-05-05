"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWhopProductData = generateWhopProductData;
exports.testWhopProductGeneration = testWhopProductGeneration;
function generateWhopProductData(beatTitle, licenseType, licenseTerms) {
    const term = licenseTerms[licenseType];
    const fileType = licenseType === 'basic' ? 'MP3' : licenseType === 'premium' ? 'WAV' : 'WAV + Track Stems';
    // Generate headline based on license type and terms
    let headline = '';
    if (licenseType === 'basic') {
        headline = `High quality ${fileType} lease for up to ${term.streams} streams`;
    }
    else if (licenseType === 'premium') {
        headline = `Premium ${fileType} lease for up to ${term.streams} streams`;
    }
    else {
        headline = `Unlimited ${fileType} lease with full rights`;
    }
    // Generate comprehensive description
    const description = generateDescription(term, fileType);
    return {
        title: `${beatTitle} - ${licenseType.charAt(0).toUpperCase() + licenseType.slice(1)}`,
        headline,
        description,
        visibility: 'visible'
    };
}
function generateDescription(term, fileType) {
    const sections = [
        // Overview
        term.description,
        // What you get
        `\n📁 **What You Get:**\n• High quality ${fileType} file${fileType.includes('+') ? '' : ' of the beat'}`,
        // Usage limits
        `\n📊 **Usage Limits:**\n• Streaming Limit: ${term.streams}\n• Digital Sales Limit: ${term.sales}\n• Music Videos: ${term.videos}\n• Live Performances: ${term.performances}\n• Publishing Rights: ${term.publishing}`,
        // What you CAN do
        `\n✅ **What You CAN Do:**\n${term.canDo.map((item) => `• ${item}`).join('\n')}`,
        // What you CANNOT do
        `\n🚫 **What You CANNOT Do:**\n${term.cannotDo.map((item) => `• ${item}`).join('\n')}`,
        // Additional info
        `\n💰 **Keep 100%** of your master recording royalties and publishing rights as specified above.`
    ];
    return sections.join('\n');
}
// Example usage and testing function
function testWhopProductGeneration() {
    const mockTerms = {
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
    const beatTitle = "Superstar";
    // Generate for all license types
    const basic = generateWhopProductData(beatTitle, 'basic', mockTerms);
    const premium = generateWhopProductData(beatTitle, 'premium', mockTerms);
    const unlimited = generateWhopProductData(beatTitle, 'unlimited', mockTerms);
    return { basic, premium, unlimited };
}
