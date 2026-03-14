export function detectIntent(query: string): string {

    const q = query?.trim().toLowerCase();

    if (q.includes("weather") || q.includes("temperature") || q.includes("forecast")) {
        return "weather";
    }
    if (q.includes("order") || q.includes("orders")) {
        return "order";
    }

    if (q.includes("accounts") || q.includes("balance") || q.includes("transaction") || q.includes("account")) {
        return "account";
    }

    return "unknown";
}
