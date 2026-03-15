        ┌────────────────────────────┐
        │        User (Frontend)     │
        │  - Types query             │
        │  - Clicks 'Ask'            │
        └─────────────┬─────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │ askAssistant() API Call │
         │ POST /api/assistant     │
         │ Headers:                │
         │  - Content-Type: json   │
         │  - X-API-Key            │
         └─────────────┬───────────┘
                      │
                      ▼
       ┌────────────────────────────┐
       │ Express Backend API         │
       │ Middleware:                 │
       │ 1. Helmet (security headers)│
       │ 2. CORS (allowed origins)  │
       │ 3. Rate Limit (10 req/sec) │
       │ 4. API Key check            │
       └─────────────┬──────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │ runAssistant(query)     │
         │ 1. Detect intent        │
         │ 2. Select tool from     │
         │    toolRegistry         │
         │ 3. Retry logic starts   │
         └─────────────┬───────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │ Retry logic / Tool Exec │
         │ - Attempt tool function │
         │ - If fail, exponential │
         │   backoff + jitter      │
         │ - Log each attempt      │
         │ - Max retries → error   │
         └─────────────┬───────────┘
                      │
                      ▼
       ┌────────────────────────────┐
       │ AssistantResponse returned │
       │ Fields:                   │
       │  - status (success/error) │
       │  - response (text)        │
       │  - logs (execution timeline) │
       └─────────────┬──────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │ Frontend updates UI:     │
        │ - Display assistant text │
        │ - Show execution logs    │
        │ - Retry button if error  │
        └──────────────────────────┘