
import "../styles/responseCard.css";
import { ResponseProps } from "../types";

export default function ResponseCard({ response }: ResponseProps) {

  if (!response) return null;

  return (
    <div className="response-card">

      <h3>Assistant Response</h3>

      <p>{response}</p>

    </div>
  );
}