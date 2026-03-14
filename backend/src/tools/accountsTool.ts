import { ToolResult } from "../types";

export async function accountTool(): Promise<ToolResult> {

    await new Promise((r) => setTimeout(r, 300));

    return {
        success: true,
        data: "Your account has 3 orders and ₹250 wallet balance."
    };
}