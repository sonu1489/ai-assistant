import { weatherTool } from "./weatherTool";
import { ordersTool } from "./orderTool";
import { accountTool } from "./accountsTool";
import { ToolResult } from "../types";

export const toolRegistry: Record<string, () => Promise<ToolResult>> = {
    weather: weatherTool,
    order: ordersTool,
    account: accountTool
};