export type ToolResult = {
    success: boolean;
    data?: string;
    error?: string;
};

export type AssistantResponse = {
    status: "success" | "error";
    response: string;
    logs: string[];
};