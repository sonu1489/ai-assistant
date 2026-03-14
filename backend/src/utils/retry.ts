import { ToolResult } from "../types";

export async function retry(
    fn: () => Promise<ToolResult>,
    logs: string[],
    maxRetries = 3
): Promise<ToolResult> {

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {

            const result = await fn();

            if (result.success) {
                logs.push(`Attempt ${attempt} succeeded`);
                return result;
            }

            logs.push(`Attempt ${attempt} failed: ${result.error}`);
        } catch (error) {
            // Handle unexpected errors (network crash, JSON parse error, etc.)
            const errorMessage = error instanceof Error ? error.message : String(error);
            logs.push(`Attempt ${attempt} crashed: ${errorMessage}`);
        }

        if (attempt < maxRetries) {
            // Calculate exponential backoff: 500ms, 1000ms, 2000ms
            const baseDelay = 500 * Math.pow(2, attempt - 1);

            // Add jitter: random ±100ms to spread out requests
            const jitter = Math.random() * 200 - 100; // -100 to +100
            const totalDelay = Math.max(0, baseDelay + jitter);

            logs.push(`Retrying in ${totalDelay.toFixed(0)}ms...`);
            await new Promise((r) => setTimeout(r, totalDelay));
        }
    }

    return {
        success: false,
        error: "All retry attempts failed"
    };
}