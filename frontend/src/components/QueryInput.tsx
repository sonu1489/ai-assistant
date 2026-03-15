import { useState } from "react";
import "../styles/QueryInput.css";
import { QueryInputProps } from "../types";


export default function QueryInput({ onSubmit, loading }: QueryInputProps) {

  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSubmit(query);
  };

  return (
    <div className="query-container">

      <input
        id="query"
        name="query"
        className="query-input"
        placeholder="Ask about weather, order and account..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
         onKeyDown={(e) => {
           if (e.key === "Enter") handleSubmit();
         }}
        disabled={loading}
        />

      <button
      className="query-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        Ask
      </button>

    </div>
  );
}