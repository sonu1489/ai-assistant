import { detectIntent } from "../classifier/intenetClassifier";

import { retry } from "../utils/retry";
import { AssistantResponse } from "../types";
import { toolRegistry } from "../tools/Toolregistry";
import { errorResponse, successResponse } from "../utils/response";


export async function runAssistant(query: string): Promise<AssistantResponse> {

    const logs: string[] = [];

    logs.push("Received query");
    try {
        if (!query || typeof query !== "string" || query?.trim().length === 0) {
            logs.push("Error: Invalid query type");

            return errorResponse("Query must be a non-empty string", logs);
        }

        const intent = detectIntent(query);

        logs.push(`Intent detected: ${intent}`);

        const toolFn = toolRegistry[intent];

        // Handle unknown intent
        if (!toolFn) {
            logs.push("No matching tool found");

            return errorResponse("Sorry, I couldn't understand your request.", logs);
        }

        logs.push(`Executing ${intent} tool`);

        // Execute tool with retry
        const result = await retry(toolFn, logs);

        if (!result.success) {
            const errorMessage = result.error || "Tool execution failed";
            return errorResponse(errorMessage, logs);
        }

        return successResponse(result.data || "", logs);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logs.push(`Unexpected error: ${errorMessage}`);
        return errorResponse("An unexpected error occurred. Please try again later.", logs);

    }
}