import { ToolResult } from "../types";

export async function weatherTool(): Promise<ToolResult> {

    await new Promise((r) => setTimeout(r, 500));

    // simulate random failure
    if (Math.random() < 0.4) {
        return {
            success: false,
            error: "Weather API timeout"
        };
    }

    return {
        success: true,
        data: "Delhi temperature is 32°C and sunny ☀️"
    };
}