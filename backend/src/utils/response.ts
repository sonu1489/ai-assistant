import { AssistantResponse } from "../types";

export function successResponse(
    response: string,
    logs: string[]
): AssistantResponse {
    return {
        status: "success",
        response,
        logs
    };
}

export function errorResponse(message: string, logs: string[]): AssistantResponse {
    return {
        status: "error",
        response: message,
        logs
    };
}