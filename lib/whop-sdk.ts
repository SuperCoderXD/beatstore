import { Whop } from "@whop/sdk";

let whopsdkInstance: Whop | null = null;

export function getWhopSdk(overrideApiKey?: string): Whop {
	if (whopsdkInstance && !overrideApiKey) return whopsdkInstance;

	const apiKey = overrideApiKey || process.env.WHOP_API_KEY;
	
	whopsdkInstance = new Whop({
		appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
		apiKey: apiKey,
		webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || ""),
	});

	return whopsdkInstance;
}
