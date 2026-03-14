# AI Support Assistant – Full Stack Assignment

## 1. Project Overview

This project implements a small **AI-style support assistant** that accepts a user query, determines the appropriate tool to execute, and returns a response along with execution logs.

The system simulates how modern AI assistants orchestrate tool execution behind the scenes.

Supported tools:

* Weather Tool
* Orders Tool
* Account Summary Tool

The backend determines which tool to execute based on the user query and handles retries for intermittent failures. The frontend displays the response and execution timeline.

For this submission, the project is shared as a **ZIP archive containing both frontend and backend projects**.

---

## 2. Architecture

High-level flow:

```
## Architecture Diagram

The system follows a simple client–server architecture where the frontend sends user queries to the backend assistant service, which detects the intent and executes the appropriate tool.

```
            ┌─────────────────────┐
            │     React UI        │
            │  (User Interface)   │
            └──────────┬──────────┘
                       │
                       │ HTTP Request
                       │ POST /api/assistant
                       ▼
            ┌─────────────────────┐
            │   Express Server    │
            │  API Layer          │
            └──────────┬──────────┘
                       │
                       │ Middleware
                       │ (Helmet, CORS, Rate Limit, API Key)
                       ▼
            ┌─────────────────────┐
            │  Assistant Service  │
            │  Intent Detection   │
            └──────────┬──────────┘
                       │
                       │ Tool Selection
                       ▼
            ┌─────────────────────┐
            │     Tool Registry   │
            │  weather / order    │
            │  account tools      │
            └──────────┬──────────┘
                       │
                       │ Retry Logic
                       ▼
            ┌─────────────────────┐
            │     Tool Execution  │
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │   Response + Logs   │
            └─────────────────────┘
```

```

Explanation:

1. User submits a query from the frontend.
2. The backend determines the intent of the query using keyword matching.
3. The corresponding tool is selected.
4. Tool execution is wrapped with retry logic.
5. The backend returns:

   * Assistant response
   * Execution logs
   * Status (success/failure)
6. The frontend displays the response and execution timeline.

---

## 3. Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS (component-based styling)

### Backend

* Node.js
* Express
* TypeScript

### Data

* In-memory mock data (no database used)

---

## 4. Project Structure

```
ai-support-assistant
│
├── backend
│   ├── src
│   │   ├── services
│   │   ├── tools
│   │   ├── utils
│   │   ├── types.ts
│   │   └── server.ts
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── QueryInput.tsx
│   │   │   ├── ResponseCard.tsx
│   │   │   └── LogTimeline.tsx
│   │   │
│   │   ├── styles
│   │   │   ├── app.css
│   │   │   ├── queryInput.css
│   │   │   ├── responseCard.css
│   │   │   └── logTimeline.css
│   │   │
│   │   ├── api
│   │   │   └── assistantApi.ts
│   │   │
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│
└── README.md
```

Note:
The backend currently handles routing directly within `server.ts` since the application is small. A separate routes layer can easily be added if the project grows.

---

## 5. Setup Instructions

### Extract the ZIP file

Unzip the project folder.

```
ai-support-assistant
```

---

### Start Backend

```
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### Start Frontend

Open a new terminal.

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 6. API Design

### Endpoint

```
POST /api/assistant
GET /health → checks if backend service is running
```

### Request

```
{
  "query": "weather in delhi"
}
```

### Response

```
{
  "status": "success",
  "response": "Delhi temperature is 32°C and sunny",
  "logs": [
    "Received query",
    "Intent detected: weather",
    "Executing weather tool",
    "Attempt 1 failed",
    "Retrying...",
    "Attempt 2 succeeded"
  ]
}
```

Fields:

| Field    | Description        |
| -------- | ------------------ |
| status   | success or error   |
| response | assistant message  |
| logs     | execution timeline |

---

## 7. Tool Execution Logic

The backend supports three tools:

### Weather Tool

Simulates retrieving weather data.

Example queries:

* "weather in delhi"
* "temperature in mumbai"

This tool intentionally includes **random failure simulation** to test retry logic.

---

### Orders Tool

Returns a mock order status.

Example queries:

* "where is my order"
* "order status"

---

### Account Summary Tool

Returns account information.

Example queries:

* "show my account"
* "account summary"

---

## 8. Retry & Resilience Strategy

One requirement of the assignment is to simulate **intermittent tool failure** and implement retry logic.

### Intermittent Failure

The weather tool randomly fails using a probability check to simulate unreliable external APIs.

### Retry Mechanism

Tool execution is wrapped inside a retry utility.

Retry logic includes exponential backoff and jitter to simulate production-grade resilience patterns and avoid retry storms.

The retry mechanism is implemented as a reusable utility wrapper, allowing any tool execution to be easily protected with the same resilience strategy without duplicating retry logic.

Behavior:

1. Execute tool
2. If failure occurs
3. Retry up to **3 attempts**
4. Log each attempt
5. Return final success or failure

Example execution timeline:

```
Received query
Intent detected: weather
Executing weather tool
Attempt 1 failed
Retrying...
Attempt 2 succeeded
```

### Handling High Traffic / Server Recovery Scenario

The retry logic was implemented with real-world scenarios in mind.

For example:

If many users hit the service at the same time and the tool fails temporarily (e.g., external API downtime), the retry mechanism prevents immediate failure by:

* retrying failed operations
* spacing retry attempts
* avoiding unnecessary crashes from transient errors

This helps the system remain resilient during **temporary outages or heavy traffic bursts**, similar to patterns used in production systems.

---
## 9. Security Features

The backend API includes several production-style security protections.

### 9.1. Helmet Security Headers

The API uses **Helmet** middleware to automatically add secure HTTP headers that protect against common web vulnerabilities such as Cross-Site Scripting (XSS), clickjacking, and MIME sniffing attacks.

Example header added:

* Content-Security-Policy

These headers improve the overall security posture of the application.

---

### 9.2. API Key Authentication

All requests to the assistant endpoint must include an API key in the request header:

```
X-API-Key: <your-api-key>
```

This ensures that only authorized clients can access the API.

---

### 9.3. Rate Limiting

To protect the server from abuse or accidental overload, the API uses request rate limiting.

Current configuration:

### 9.4 **10 requests per second per client**

If the limit is exceeded, the server returns:

```
HTTP 429 Too Many Requests
```

This helps protect the system from denial-of-service scenarios.

---

### 9.5. CORS Origin Restriction

Cross-Origin Resource Sharing (CORS) is configured to allow requests only from trusted frontend origins.

Example configuration:

```
http://localhost:5173
https://myfrontendapp.com
```

This prevents unauthorized websites from directly calling the API.


## 10. UI Features

Frontend features:

* Query input field
* Assistant response display
* Execution logs timeline
* Loading state while request is processing
* Retry button if request fails
* Disabled submit button during loading

The UI separates styling into component-based CSS files for better maintainability.

---

## 11. Tradeoffs

Some simplifications were made due to the scope of the assignment:

* Intent detection uses **simple keyword matching** instead of an NLP model.
* Tool data is mocked instead of using real APIs.
* No database was used; responses are generated from in-memory data.

These decisions keep the system simple while demonstrating the required architecture.

---

## 12. Improvements With More Time

Possible improvements include:

* Replace keyword matching with an LLM-based intent classifier
* Add streaming logs using WebSockets or Server-Sent Events
* Add Docker setup for easier deployment
* Implement unit tests for tools and retry logic
* Improve UI with chat-style interface
* Add persistent conversation history

---

## Summary

This project demonstrates:

* Tool-based AI assistant architecture
* Backend retry and resilience patterns
* Clean frontend-backend API interaction
* Execution transparency through logs
* Organized and maintainable code structure
