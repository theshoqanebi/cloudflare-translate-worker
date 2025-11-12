# 🌐 Cloudflare Translate Worker

A lightweight Cloudflare Worker that mirrors the Google Translate API to provide simple and fast translation via a unified endpoint:  
`/v1/api/translate/`

This worker receives JSON POST requests and relays them to Google Translate’s public API, returning the translated text in a standardized format with proper CORS support.

---

## 🚀 Features

- Accepts **POST** requests with JSON payloads.  
- Uses **Google Translate (unofficial)** API endpoint.  
- Includes **CORS** headers for browser clients.  
- Returns clean JSON responses with translation results.  
- Handles errors gracefully (invalid JSON, missing params, upstream errors).

---

## 📦 Example Request

**Endpoint:**  
```
POST https://<your-worker-domain>/v1/api/translate/
```

**Body (JSON):**
```json
{
  "source-lang": "en",
  "target-lang": "ar",
  "query": "hello world"
}
```

---

## ✅ Example Response

```json
{
  "status": "ok",
  "result": "مرحبا بالعالم",
  "source-lang": "en",
  "target-lang": "ar"
}
```

---

## ⚠️ Error Responses

| Condition | Status | Example Response |
|------------|---------|------------------|
| Missing parameters | 400 | `{ "status": "error", "error": "Missing parameters" }` |
| Invalid JSON | 400 | `{ "status": "error", "error": "Invalid JSON body" }` |
| Not Found | 404 | `{ "status": "error", "error": "Not found" }` |
| Google API failure | 502 | `{ "status": "error", "error": "Upstream error" }` |
| Internal exception | 500 | `{ "status": "error", "error": "Internal error" }` |

---

## 🔧 Deployment

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Initialize Project
```bash
wrangler init translate-worker
cd translate-worker
```

### 4. Replace `src/index.js` with `worker.js`
Place the code provided in your `worker.js` file.

### 5. Publish the Worker
```bash
wrangler deploy
```

Your endpoint will be available at:
```
https://<your-worker-subdomain>.workers.dev/v1/api/translate/
```

---

## 🧩 CORS Support

This worker allows requests from any origin:

```js
"Access-Control-Allow-Origin": "*"
"Access-Control-Allow-Methods": "POST, OPTIONS"
"Access-Control-Allow-Headers": "Content-Type"
```

It also handles **OPTIONS** requests for preflight checks automatically.

---

## 📁 File Structure

```
.
├── worker.js
├── wrangler.toml
└── README.md
```

---

## 🧠 Notes

- This is an **unofficial wrapper** around Google Translate’s web API.  
- Do not use for heavy commercial translation loads — rate limits may apply.  
- Perfect for small apps, prototypes, or hobby projects needing quick translations.

---

## 🪪 License

MIT License © 2025 — Open Source and free to use.
