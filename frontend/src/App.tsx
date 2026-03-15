import { useState } from "react";
import QueryInput from "./components/QueryInput";
import ResponseCard from "./components/ResponseCard";
import LogTimeline from "./components/LogTimeline";
import { askAssistant } from "./API/assistantApi";
import { AssistantResponse } from "./types";
import "./styles/app.css";

function App() {

  const [data, setData] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const handleQuery = async (query: string) => {
try {
    setLastQuery(query);
    setLoading(true);
    setData(null);

    const res = await askAssistant(query);

    setData(res);
    setLoading(false);
  } catch (error: any) {
    setData({
       status: error.status,
    response: error.response,
    logs: error.logs, });
    setLoading(false);

  };
}

  return (
    <div className="app-page">

      <div className="app-container">

        <h2 className="app-title">AI Support Assistant</h2>

        <QueryInput onSubmit={handleQuery} loading={loading} />

        {loading && (
         <div className="loading-text">
            Processing request...
          </div>
        )}

        {data && (
          <>
            <ResponseCard response={data.response} />

            <LogTimeline logs={data.logs} />

            {data.status === "error" && (
              <button
               className="retry-button"
                onClick={() => handleQuery(lastQuery)}
              >
                Retry
              </button>
            )}
          </>
        )}

      </div>

    </div>
  );
}


export default App;