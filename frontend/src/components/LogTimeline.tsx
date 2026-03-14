import "../styles/logTimeline.css";
import {LogsProps} from "../types";

export default function LogTimeline({ logs }: LogsProps) {

  if (!logs.length) return null;

  return (
     <div className="timeline">

      <h3>Execution Timeline</h3>

      <ul >
        {logs.map((log, index) => {

          const isFail = log.toLowerCase().includes("failed");

          return (
            <li
              key={index}
              className={isFail ? "fail" : ""}
            >
              {isFail ? "✖" : "✔"} {log}
            </li>
          );
        })}
      </ul>

    </div>
  );
}

