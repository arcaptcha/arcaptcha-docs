---
sidebar_position: 1
---

# Quick Start

The ARCaptcha widget can protect your applications from bots, spam, SMS fraud, and other forms of automated abuse. Installing ARCaptcha is fast and easy. It requires either adding some simple HTML and server side code.

<iframe
  src="https://player.arvancloud.ir/index.html?config=https://arcaptcha.arvanvod.ir/vzZDAx3V6m/N3o8nYXRAy/origin_config.json"
  width="100%"
  height="400"
  style={{border: 0}}
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

## 1. Get your Site Key and Secret Key

Before adding the widget, you need credentials from the [ARCaptcha dashboard](https://dashboard.arcaptcha.co/log-in):

1. [Sign up or log in](https://dashboard.arcaptcha.co/log-in) to the ARCaptcha dashboard.
2. Create a new site (or select an existing one).
3. Copy your **site key** — used client-side in `data-site-key`.
4. Copy your **secret key** — used server-side when calling the verify API.

:::caution
Never expose your secret key in client-side code or public repositories.
:::

:::info
Using Claude Code, Cursor or another agent? Follow [Agent](./agent.md) section to make your agent an expert.
:::

:::info
Prefer a framework or platform integration? Check the [Plugins](./plugins.md) section for available libraries and plugins.
:::

## 2. How it works

You embed the ARCaptcha widget on your site—for example, on a login or signup form.

### Frontend

1. You embed the ARCaptcha widget on your website, for example, in a login form.

<details>
<summary>Frontend Code Example (Simple)</summary>

```html
<html>
  <head>
    <title>ARCaptcha Demo</title>
    <script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>
  </head>
  <body>
    <form method="POST" action="/login">
      <!-- Your other fields, like email and password, go here -->
      <input type="text" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />

      <!-- ARCaptcha widget -->
      <div class="arcaptcha" data-site-key="YOUR_SITE_KEY"></div>

      <br />

      <!-- The hidden `arcaptcha-token` is added automatically after solving -->
      <input type="submit" value="Submit" />
    </form>
  </body>
</html>
```

</details>

<details>
<summary>Frontend Code Example (Programmatic)</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>ARCaptcha Execute Example</title>
    <!-- 1. Load ARCaptcha Widget -->
    <script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>

    <script>
      let widgetId = null;

      // 2. Render invisible ARCaptcha widget programmatically
      function initARCaptcha() {
        widgetId = arcaptcha.render("#arcaptcha-container", {
          site_key: "YOUR_SITE_KEY",
          size: "invisible",
          callback: onSolve,
          error_callback: onError,
          expired_callback: onExpired,
        });
      }

      function onSolve(token) {
        // Called after successful challenge solve
        console.log("ARCaptcha solved:", token);
        document.getElementById("demo-form").submit();
      }

      function onError(err) {
        console.error("ARCaptcha error:", err);
      }

      function onExpired() {
        console.warn("ARCaptcha token expired");
      }

      function onManualStep(event) {
        event.preventDefault();
        // 3. Trigger the ARCaptcha workflow programmatically
        if (widgetId === null) {
          console.error("Widget not yet initialized");
        } else {
          arcaptcha.execute(widgetId);
        }
      }

      window.onload = initARCaptcha;
    </script>
  </head>
  <body>
    <form id="demo-form" action="/submit" method="POST">
      <input type="text" name="name" placeholder="Name" required /><br /><br />
      <!-- 4. Widget container -->
      <div id="arcaptcha-container"></div>
      <br />
      <button id="submit-btn" onclick="onManualStep(event)">Submit</button>
    </form>
  </body>
</html>
```

</details>

2. The user completes an ARCaptcha challenge (checkbox or interactive challenge).
3. ARCaptcha returns a token, which is embedded in your form as `arcaptcha-token`.
4. The user submits the form. The token is sent to your server along with the form data.

### Backend

5. Your server sends the token, site key, and secret key to the ARCaptcha verify API.

<details>
<summary>Backend Code Example (Python / Flask)</summary>

```python
import os
import requests
from flask import Flask, request, jsonify

# ARCaptcha verification API endpoint
ARCAPTCHA_VERIFY_URL = "https://api.arcaptcha.co/arcaptcha/api/verify"

# Your credentials from the ARCaptcha dashboard
SITE_KEY = os.getenv("ARCAPTCHA_SITE_KEY", "your_site_key")
SECRET_KEY = os.getenv("ARCAPTCHA_SECRET_KEY", "your_secret_key")

app = Flask(__name__)

def verify_arcaptcha_token(token: str) -> dict:
    """
    Sends a POST request to ARCaptcha's verify endpoint
    and returns a result dict including 'success' (bool)
    and any error or response fields.
    """
    payload = {
        "secret_key": SECRET_KEY,
        "site_key": SITE_KEY,
        "challenge_id": token,
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(ARCAPTCHA_VERIFY_URL, json=payload, headers=headers)
    response.raise_for_status()

    data = response.json()
    return {
        "success": data.get("success", False),
        "data": data,
    }

@app.route("/login", methods=["POST"])
def login():
    # 1) Retrieve token from form POST
    token = request.form.get("arcaptcha-token")
    if not token:
        return jsonify({"error": "Missing ARCaptcha token"}), 400

    # 2) Verify token via ARCaptcha API
    result = verify_arcaptcha_token(token)

    # 3) Decision logic
    if result["success"]:
        # Token is valid -> proceed with your business logic
        return jsonify({"status": "Logged in"}), 200
    else:
        # Verification failed
        return jsonify({
            "error": "Verification failed",
            "details": result["data"],
        }), 403

if __name__ == "__main__":
    app.run(debug=True, port=5000)
```

</details>

6. ARCaptcha verifies the token and returns whether it is valid, allowing your server to determine whether to accept the request.
7. Based on the verification result, your server determines that the requester is not a bot and allows the request to proceed (e.g., login or signup). Pretty simple!
