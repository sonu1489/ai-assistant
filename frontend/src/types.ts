export type AssistantResponse = {
    status: "success" | "error";
    response: string;
    logs: string[];
};
export type LogsProps = {
    logs: string[];
};

export type QueryInputProps = {
    onSubmit: (query: string) => void;
    loading: boolean;
};

export type ResponseProps = {
    response: string;
};