# GitGauge Server REST API Documentation

All server endpoints are prefixed with `/api` and return standardized JSON envelopes.

---

## 🔒 Security & Client Controls

### 1. Speed Rate Limit Walls
To safeguard third-party GitHub public tokens and server resources, separate speed limiters are enforced at the network gateway:
- **Core Analysis Sync (`GET /api/profile/:username`)**: Restricted to a maximum of **20 requests per 15 minutes** per client IP address.
- **General Database Queries (`GET /api/profiles`, `GET /api/history`)**: Restricted to a maximum of **100 requests per 15 minutes** per client IP address.

### 2. Standardized JSON Envelope
Every response presents a uniform structure to streamline parsing:
- **Successful Responses:** `{ success: true, message: "...", data: {...}, meta?: {...} }`
- **Error Responses:** `{ success: false, error: { message: "...", status: 400, details?: {...} } }`

---

## 📡 Endpoints Registry

### 🛠️ Swagger UI Playground
- **Local Dev Sandbox:** `http://localhost:5001/api-docs`
- Interactive Swagger panel containing routes schemas, query sandbox, and model definitions.

---

### 1. Trigger Live Profile Analysis
Triggers live synchronization of a developer handle from the GitHub API, computes metrics, writes logs, and caches details.
- **HTTP Method:** `GET`
- **Endpoint:** `/api/profile/:username`
- **Path Parameter:**
  - `username` (Required): Valid GitHub handle. Must comply with GITHUB_USERNAME_REGEX constraints (alphanumeric and hyphens, up to 39 characters, no double hyphens, no starting/ending hyphens).
- **Mock Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile analyzed and stored successfully.",
  "data": {
    "id": 12,
    "username": "yyx990803",
    "name": "Evan You",
    "avatar_url": "https://avatars.githubusercontent.com/u/499550?v=4",
    "bio": "Creator of Vite & Vue.",
    "location": "Singapore",
    "public_repos": 82,
    "followers": 92452,
    "following": 98,
    "followers_following_ratio": 943.39,
    "total_stars": 412,
    "total_forks": 1243,
    "top_language": "TypeScript",
    "most_popular_repo": "vite",
    "account_age_years": 12.35,
    "profile_score": 100,
    "developer_level": "Expert",
    "recent_activity_insights": {
      "recent_commits": 22,
      "primary_activity": "PushEvent",
      "description": "Extremely prolific contributor with 22 commits, highly active on repository [vite]."
    },
    "github_created_at": "2013-09-18T10:04:12.000Z",
    "created_at": "2026-05-30T10:49:25.000Z",
    "updated_at": "2026-05-30T10:49:25.000Z",
    "repositories": [
      {
        "id": 123456,
        "name": "vite",
        "html_url": "https://github.com/vitejs/vite",
        "description": "Next generation frontend tooling.",
        "language": "TypeScript",
        "stargazers_count": 68420,
        "forks_count": 12430,
        "size": 4210
      }
    ]
  }
}
```

---

### 2. Fetch Directory of Analyzed Profiles
Retrieve paginated lists of developer analyses saved in MySQL with advanced filter parameters.
- **HTTP Method:** `GET`
- **Endpoint:** `/api/profiles`
- **Query Parameters:**
  - `page` (Default: `1`): Page offset.
  - `limit` (Default: `10`): Candidates limit per page (1-100).
  - `sortBy` (Default: `created_at`): Sort criteria key (`profile_score`, `followers`, `public_repos`, `total_stars`, `created_at`).
  - `order` (Default: `desc`): Sorting direction (`asc` or `desc`).
  - `developer_level`: Filter by tier (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
  - `top_language`: Filter by language (e.g. `TypeScript`, `JavaScript`, `Rust`, `C`).
- **Mock Response (200 OK):**
```json
{
  "success": true,
  "message": "Analyzed profiles retrieved successfully.",
  "data": [
    {
      "id": 12,
      "username": "yyx990803",
      "name": "Evan You",
      "avatar_url": "https://avatars.githubusercontent.com/u/499550?v=4",
      "profile_score": 100,
      "developer_level": "Expert"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 3. Fetch Single Cached Profile Details
Retrieve details of a cached candidate profile using its auto-increment ID.
- **HTTP Method:** `GET`
- **Endpoint:** `/api/profiles/:id`
- **Path Parameter:**
  - `id` (Required): Auto-increment primary key of the profile record.
- **Mock Response (200 OK):**
```json
{
  "success": true,
  "message": "Analyzed profile details retrieved successfully.",
  "data": {
    "id": 12,
    "username": "yyx990803",
    "name": "Evan You",
    "profile_score": 100,
    "repositories": []
  }
}
```

---

### 4. Fetch Search History Audit logs
Retrieves recent query attempts, IP indicators, and execution statuses.
- **HTTP Method:** `GET`
- **Endpoint:** `/api/history`
- **Query Parameter:**
  - `limit` (Default: `50`): Maximum logs entries to pull (1-100).
- **Mock Response (200 OK):**
```json
{
  "success": true,
  "message": "Search logs retrieved successfully.",
  "data": [
    {
      "id": 12,
      "username": "yyx990803",
      "searched_at": "2026-05-30T10:49:25.000Z",
      "ip_address": "127.0.0.1",
      "status": "SUCCESS",
      "error_message": null
    }
  ]
}
```
