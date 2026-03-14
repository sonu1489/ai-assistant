import { ToolResult } from "../types";

export async function ordersTool(): Promise<ToolResult> {

    await new Promise((r) => setTimeout(r, 400));

    return {
        success: true,
        data: "Your order #1234 has been shipped and will arrive tomorrow."
    };
}