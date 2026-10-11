---
name: arcaptcha-integration
description: "Complete guide for AI coding assistants to integrate ARCaptcha bot protection into web and backend applications."
---

# ARCaptcha Integration Guide for AI Agents

This specification provides autonomous AI coding agents (Claude Code, Cursor, ChatGPT, OpenCode, and others) with authoritative, self-contained technical instructions to integrate ARCaptcha into any web application or backend service.

---

## 1. Security Architecture & Key Separation

ARCaptcha uses a two-key cryptographic security architecture. **Strict separation between the public Site Key and private Secret Key is mandatory:**

| Key | Environment | Placement | Security Rule |
| :--- | :--- | :--- | :--- |
| **Site Key** (`site_key`) | Public (Client-Side) | HTML container attribute `data-site-key`, SDK config | Safe to expose in client-side bundles and frontend markup. |
| **Secret Key** (`secret_key`) | Private (Server-Side) | Server environment variables (e.g., `ARCAPTCHA_SECRET_KEY`) | **CRITICAL SECURITY REQUIREMENT**: NEVER expose, bundle, commit, or send the Secret Key in client-side JavaScript, mobile frontend code, or public repositories. The Secret Key must ONLY be accessed by trusted backend servers when communicating directly with the ARCaptcha verification API. |

---

## 2. Client-Side Integration (Frontend)

To protect a form against automated bots, perform two steps: inject the widget script and mount the captcha container.

### Step 2.1: Script Injection
Include the ARCaptcha script via HTTPS on pages containing protected forms. Place it in `<head>` or before the closing `</body>`:

```html
<script src="https://nwidget.arcaptcha.ir/1/api.js" async defer></script>
```

*(Optional: For mobile WebViews, domain override can be appended: `<script src="https://nwidget.arcaptcha.ir/1/api.js?domain=example.com" async defer></script>`)*

### Step 2.2: Container Placement
Place the `.arcaptcha` container inside your HTML `<form>`:

```html
<form method="POST" action="/login">
  <input type="text" name="username" required />
  <input type="password" name="password" required />

  <!-- ARCaptcha Widget Container -->
  <div class="arcaptcha" data-site-key="YOUR_PUBLIC_SITE_KEY"></div>

  <button type="submit">Submit</button>
</form>
```

When solved, ARCaptcha automatically injects a hidden form input named `arcaptcha-token` containing the challenge token string. When the user submits the form, `arcaptcha-token` is sent along with other form fields to your server.

### Step 2.3: Programmatic & Invisible Mode
If preferred, you can trigger ARCaptcha programmatically or invisibly:

```javascript
// Render invisibly
const widgetId = arcaptcha.render("#arcaptcha-container", {
  site_key: "YOUR_PUBLIC_SITE_KEY",
  size: "invisible",
  callback: (token) => {
    // token received, submit form or trigger API request
    document.getElementById("login-form").submit();
  },
  error_callback: (err) => console.error("ARCaptcha error:", err),
  expired_callback: () => console.warn("Token expired"),
});

// Trigger challenge on form submit or user action
arcaptcha.execute(widgetId);
```

---

## 3. Server-Side Verification (Backend)

Once the client submits `arcaptcha-token`, your server must verify it before executing sensitive business logic (user login, registration, password reset, payment, etc.).

### Verification Endpoint Contract
- **URL**: `https://api.arcaptcha.co/arcaptcha/api/verify`
- **HTTP Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Payload (JSON)**:
  - `site_key` (string, required): Your public site key.
  - `secret_key` (string, required): Your private secret key (read from server environment).
  - `challenge_id` (string, required): The token received from the client form (`arcaptcha-token`).

### Response Contract
```json
{
  "success": true,
  "error-codes": []
}
```

If `success` is `true`, allow the operation to proceed. If `false`, reject the request with HTTP 400/403.

### Error Code Reference
- `missing-input-sitekey`: The `site_key` parameter is missing.
- `missing-input-secret`: The `secret_key` parameter is missing.
- `missing-input-response`: The `challenge_id` parameter is missing.
- `bad-request`: Malformed or invalid request body.
- `invalid-input-sitekey`: Invalid `site_key`.
- `invalid-input-secret`: Invalid `secret_key`.
- `invalid-input-response`: Invalid or expired `challenge_id`.
- `timeout-or-duplicate`: Token was already verified once or expired.

---

## 4. Official SDKs and Libraries

Prefer official or community libraries matching your technology stack:

### Frontend
- **React**: [arcaptcha-react](https://github.com/arcaptcha/Arcaptcha-React-js) (`npm install arcaptcha-react`)
- **Vue 2**: [arcaptcha-vue](https://github.com/arcaptcha/arcaptcha-vue)
- **Vue 3**: [arcaptcha-vue3](https://github.com/arcaptcha/arcaptcha-vue3)
- **Angular**: [arcaptcha-angular](https://github.com/arcaptcha/arcaptcha-angular)
- **Flutter**: [arcaptcha-flutter](https://github.com/arcaptcha/arcaptcha-flutter) / [ar_captcha](https://github.com/fateme-shm/ar_captcha)

### Backend
- **Node.js**: [arcaptcha-nodejs](https://github.com/arcaptcha/arcaptcha-nodejs)
- **Python**: [arcaptcha-python](https://github.com/arcaptcha/arcaptcha-python) / [django-arcaptcha](https://github.com/arcaptcha/django-arcaptcha)
- **PHP / Laravel**: [arcaptcha-php](https://github.com/arcaptcha/arcaptcha-php) / [arcaptcha-laravel](https://github.com/arcaptcha/arcaptcha-laravel)
- **Go**: [arcaptcha-go](https://github.com/arcaptcha/arcaptcha-go)
- **C# / .NET**: [Arcaptcha.CSharp](https://github.com/arcaptcha/Arcaptcha.CSharp)
- **Ruby**: [arcaptcha-ruby](https://github.com/evokelektrique/arcaptcha-ruby)
- **Elixir**: [arcaptcha-elixir](https://github.com/evokelektrique/arcaptcha-elixir)

### Mobile
- **Android Native**: [arcaptcha-native-android-sdk](https://github.com/arcaptcha/arcaptcha-native-android-sdk)
- **Android WebView**: [arcaptcha_android_sdk](https://github.com/arcaptcha/arcaptcha_android_sdk)

---

## 5. REST API Fallback Implementation

When no dedicated SDK is used, call the verification API directly:

### Node.js / Express Example
```javascript
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const ARCAPTCHA_VERIFY_URL = "https://api.arcaptcha.co/arcaptcha/api/verify";
const SITE_KEY = process.env.ARCAPTCHA_SITE_KEY;
const SECRET_KEY = process.env.ARCAPTCHA_SECRET_KEY; // Never expose on client

async function verifyArcaptchaToken(token) {
  const response = await fetch(ARCAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site_key: SITE_KEY,
      secret_key: SECRET_KEY,
      challenge_id: token,
    }),
  });
  return response.json();
}

app.post("/login", async (req, res) => {
  const token = req.body["arcaptcha-token"];
  if (!token) {
    return res.status(400).json({ error: "Missing ARCaptcha token" });
  }

  const verification = await verifyArcaptchaToken(token);
  if (!verification.success) {
    return res.status(403).json({ error: "Captcha verification failed", details: verification });
  }

  // Continue with business logic...
  res.json({ status: "Success" });
});
```

### Python / Flask Example
```python
import os
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

ARCAPTCHA_VERIFY_URL = "https://api.arcaptcha.co/arcaptcha/api/verify"
SITE_KEY = os.getenv("ARCAPTCHA_SITE_KEY")
SECRET_KEY = os.getenv("ARCAPTCHA_SECRET_KEY")

def verify_token(token: str) -> bool:
    payload = {
        "site_key": SITE_KEY,
        "secret_key": SECRET_KEY,
        "challenge_id": token,
    }
    response = requests.post(
        ARCAPTCHA_VERIFY_URL,
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=10,
    )
    data = response.json()
    return bool(data.get("success", False))

@app.route("/login", methods=["POST"])
def login():
    token = request.form.get("arcaptcha-token")
    if not token or not verify_token(token):
        return jsonify({"error": "Invalid captcha"}), 403
    return jsonify({"status": "Logged in"}), 200
```

---

## 6. AI Agent Integration Checklist

When asked to integrate ARCaptcha into a repository:
1. Identify the frontend framework (Plain HTML, React, Vue, Next.js, etc.) and inject the script + `.arcaptcha` container (or framework component).
2. Use the user's public `site_key` in the frontend code.
3. Locate the backend endpoint handling the form submission.
4. Extract `arcaptcha-token` from the incoming request payload.
5. Retrieve `secret_key` from backend environment variables (`process.env` / `os.getenv`).
6. Make a POST request to `https://api.arcaptcha.co/arcaptcha/api/verify` with `site_key`, `secret_key`, and `challenge_id: token`.
7. Guard business logic execution based on `success === true`.

---

## 7. Standard 1-Click Prompt

Developers invoking AI assistants (Claude Code, Cursor, ChatGPT, OpenCode) should use:

```text
Please read https://docs.arcaptcha.co/onboard.md and help me integrate ARCaptcha into this project.
```
