import { AssistantResponse } from "../types";

export async function askAssistant(query: string): Promise<AssistantResponse> {

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";;
    const res = await fetch(`${API_URL}/api/assistant`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": "sagar189"
        },
        body: JSON.stringify({ query })
    });

    const data = await res.json();

    if (!res.ok) {
        return data;
    }

    return data;
}