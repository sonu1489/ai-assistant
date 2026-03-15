import { AssistantResponse } from "../types";
import { apiClient } from "./apiClient";

export async function askAssistant(query: string): Promise<AssistantResponse> {
    return apiClient<AssistantResponse>("/assistant", "POST", { query });
}