# CareerForge-AI — Unified Daily Application Credit System Deployment Guide

## 1. Overview & Architecture

CareerForge-AI features a centralized, production-grade **Daily Application Credit System** powering both the **Mock Interview Module** and the **Aptitude Practice Module**.

### Core Principles
- **Application Credits vs Provider Usage:** Credits represent platform application currency granted to candidates, completely separate from external Gemini/LLM API tokens or rate limits.
- **Single Source of Truth:** The server is the sole authority on credit balances, generation costs, allowances, and reservations. Clients never supply, modify, or override balances or costs.
- **Unified Credit Account:** Users possess one unified `CreditAccount` covering all AI features (Mock Interview question generation and Aptitude test generation).
- **Deterministic 00:00:00 UTC Daily Reset:** Credits reset deterministically every day at **00:00:00 UTC**. Reset timestamps are transmitted in ISO 8601 UTC and formatted into each candidate's local timezone (using `Intl.DateTimeFormat`) on the Profile and Interview setup screens.
- **Dual Reset Strategy:**
  1. **Deterministic Lazy Grant (Primary):** When an authenticated user accesses their credits or requests question generation, `creditService.getOrCreateAccount` checks if the current UTC timestamp has crossed into a new 00:00 UTC daily period. If so, their allowance is refreshed atomically without requiring an in-memory timer.
  2. **Batch Job / Cron (Supplementary):** A standalone worker script (`server/utils/creditResetJob.js` or `npm run reset-credits`) is provided for batch pre-resets and stale reservation reconciliation across distributed fleets.
- **Concurrency & Overspend Safety:** Credits are deducted using atomic MongoDB operations (`findOneAndUpdate` with `{ balance: { $gte: cost } }`), guaranteeing that concurrent requests cannot overspend beyond available balance.
- **Safe Two-Phase Reservation & Refund Flow:**
  1. *Phase 1 (Reserve):* Atomically reserve credits and record a pending `RESERVE` entry in `CreditLedger` with an `idempotencyKey`.
  2. *Phase 2 (Commit):* After questions are generated and pass structural and safety validations, mark the ledger entry `COMMITTED` and clear the reservation.
  3. *Phase 3 (Refund / Rollback):* If AI generation fails, times out, receives a provider 429 quota error, or produces malformed output, reserved credits are immediately refunded atomically.
  4. *Automatic Recovery:* On server startup or periodic maintenance, `reconcileAllStaleReservations` recovers any pending reservations orphaned by server restarts or dropped client connections.
- **Idempotency Protection:** Every interview generation request passes a unique `Idempotency-Key` (in both request header and payload). Duplicate submissions replay the active reservation without double-charging.

---

## 2. Environment Configuration

Configure the following variables in `server/.env` (or your cloud platform's secrets manager):

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `DAILY_CREDIT_ALLOWANCE` | Integer | `100` | Universal daily credit allowance granted to each user at 00:00 UTC. |
| `INTERVIEW_DAILY_CREDIT_ALLOWANCE` | Integer | `100` | Optional interview-specific allowance override (defaults to `DAILY_CREDIT_ALLOWANCE`). |
| `INTERVIEW_CREDIT_COST_PER_QUESTION` | Integer | `2` | Credit cost per generated interview question (e.g. 5 questions = 10 credits). |
| `INTERVIEW_BASE_CREDIT_COST` | Integer | `0` | Optional base fee per interview session generation. |
| `INTERVIEW_RESERVATION_EXPIRY_SECONDS` | Integer | `180` | Lifespan of a pending interview reservation before stale recovery (3 minutes). |
| `APTITUDE_DAILY_CREDIT_ALLOWANCE` | Integer | `100` | Aptitude daily credit allowance (defaults to universal allowance). |
| `APTITUDE_CREDIT_COST_PER_QUESTION` | Integer | `2` | Credit cost per generated aptitude question. |
| `APTITUDE_BASE_CREDIT_COST` | Integer | `0` | Optional base fee per aptitude practice batch. |
| `APTITUDE_RESERVATION_EXPIRY_SECONDS` | Integer | `180` | Lifespan of a pending aptitude reservation (3 minutes). |
| `GEMINI_API_KEY` | String | *(Required)* | Google Gemini API key. Stored exclusively on the server, never leaked to the client. |
| `GEMINI_MODEL` | String | `gemini-2.5-flash` | Approved free-tier model (e.g., `gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-2.0-flash`). |
| `GEMINI_AI_ENABLED` | Boolean | `true` | Master kill-switch for AI question generation. If `false`, server fails closed safely. |

---

## 3. Database Schema & Indexes

### Collections

#### `creditaccounts`
Stores per-user credit balance and reset timestamps.
- `userId`: `ObjectId` (Unique, references `User`)
- `balance`: `Number` (Active spendable credits)
- `reservedBalance`: `Number` (Currently locked in active AI generations)
- `dailyAllowance`: `Number` (User's daily credit quota)
- `lastResetPeriodStart`: `Date` (Today 00:00:00.000 UTC corresponding to the current cycle)

#### `creditledgers`
Immutable audit log of all credit balance modifications.
- `userId`: `ObjectId`
- `amount`: `Number`
- `balanceAfter`: `Number`
- `type`: `DAILY_GRANT | WEEKLY_GRANT | RESERVE | COMMIT | REFUND | ADJUSTMENT`
- `status`: `PENDING | COMMITTED | RELEASED | COMPLETED`
- `idempotencyKey`: `String` (Nullable, unique for active reservations)
- `expiresAt`: `Date` (Used for TTL cleanup and stale reservation recovery)
- `metadata`: `Object` (`targetRole`, `questionCount`, `interviewType`, `difficulty`)

### Automated Index Creation
Mongoose creates all indexes automatically upon connection:
- `creditaccounts`: `{ userId: 1 }` (unique)
- `creditledgers`: `{ userId: 1, idempotencyKey: 1 }` (unique, sparse)
- `creditledgers`: `{ status: 1, expiresAt: 1 }`
- `creditledgers`: `{ userId: 1, createdAt: -1 }`

---

## 4. API Endpoints

### 1. `GET /api/interview/config`
- **Auth:** Optional (`flexibleAuth`)
- **Description:** Returns AI readiness status, active model, configurable credit pricing, and authenticated user's current credit balance without exposing API keys.
- **Response:**
  ```json
  {
    "success": true,
    "aiEnabled": true,
    "model": "gemini-2.5-flash",
    "creditPricing": {
      "costPerQuestion": 2,
      "dailyAllowance": 100,
      "resetPeriod": "daily",
      "nextReset": "2026-10-25T00:00:00.000Z"
    },
    "userCredits": {
      "balance": 100,
      "reservedBalance": 0,
      "dailyAllowance": 100,
      "resetPeriod": "daily",
      "nextReset": "2026-10-25T00:00:00.000Z"
    }
  }
  ```

### 2. `GET /api/interview/credits`
- **Auth:** Required (Bearer Token)
- **Description:** Returns the authenticated user's credit balance, allowance, next reset time, and transaction ledger.

### 3. `POST /api/interview/generate-questions`
- **Auth:** Required (Bearer Token)
- **Headers:** `Idempotency-Key: <unique_uuid>`
- **Body:**
  ```json
  {
    "targetRole": "Frontend Developer",
    "experienceLevel": "entry",
    "interviewType": "technical",
    "jobDescription": "",
    "skills": "React, JavaScript",
    "questionCount": 5,
    "idempotencyKey": "gen_123456789"
  }
  ```
- **Credit Flow:**
  - Validates question count (1-10) and options.
  - Checks rate limits (cooldown + user daily threshold).
  - Calculates cost = `questionCount * COST_PER_QUESTION`.
  - Atomically reserves credits via `reserveCredits()`.
  - Calls Google Gemini to generate role-aligned questions.
  - On Success: commits reservation via `commitReservation()`, returns `{ success: true, questions: [...], credits: { balance: 90, ... } }`.
  - On Failure (Provider error, timeout, malformed output): immediately refunds reservation via `refundReservation()`.
  - If Insufficient Credits: returns HTTP `402 Payment Required` with `{ isInsufficientCredits: true, balance: 4, required: 10, nextReset: "..." }`.

---

## 5. Deployment & Rollout Steps

### Step 1: Install Dependencies & Verify Tests
```bash
# Server tests (50 focused tests covering credits, reset, concurrency, idempotency, timers)
cd server
npm install
npm test

# Client production build
cd ../client
npm install
npm run build
```

### Step 2: Database Migration & Verification
Run the database migration and readiness script to ensure indexes exist and all users have a `CreditAccount` initialized:
```bash
cd server
node utils/migrateInterviewCredits.js
```

### Step 3: Server Startup & Recovery
When `server.js` boots, it automatically calls `reconcileAllStaleReservations()` to refund any pending reservations interrupted during deployment or restart.

### Step 4: Scheduled Daily Reset Job (Optional)
Active users are automatically reset via deterministic lazy evaluation when accessing the app on a new UTC calendar day.
To also reset inactive accounts in batch, add a daily cron at 00:00 UTC:
```bash
# Crontab entry (Linux / Render / Railway Cron):
0 0 * * * cd /app/server && npm run reset-credits >> /var/log/credit_reset.log 2>&1
```

---

## 6. Security & Verification Checklist

1. **Daily Reset Verification:** Check that accounts accessed after 00:00:00 UTC automatically restore their daily allowance.
2. **Local Timezone Formatting:** Verify that `nextReset` renders the next 00:00:00 UTC time converted to the candidate's local timezone on both Profile and Interview Setup screens.
3. **Balance Immutability:** Verify that `PUT /api/profile` ignores or rejects client-sent credit balance or allowance fields.
4. **Insufficient Credit Prevention:** Attempt question generation with `balance < requiredCost`. Verify the server returns HTTP `402 Payment Required` and displays the Insufficient Credits Modal with the local reset time.
5. **Two-Phase Refund on Failure:** Verify that if Gemini returns an error, timeout, or quota limit, the reserved credits are immediately refunded back to the user's balance and logged in `creditledgers`.
6. **Concurrent Requests:** Verify that multiple simultaneous requests with the same idempotency key or parallel overspend requests cannot drive the balance below zero.
7. **Rate Limiting & Abuse Prevention:** Check that rapid repetitive generation triggers cooldown enforcement before reaching Gemini.
8. **Secrets Isolation:** Confirm `GEMINI_API_KEY` is never logged, never exposed in client bundles, and never returned in API payloads.
