---
sidebar_position: 1
---

# شروع سریع

آرکپچا می‌تواند از سرویس‌ها و برنامه‌های شما در برابر ربات‌ها، هرزنامه‌ها و سایر آسیب‌های خودکار محافظت کند. نصب آرکپچا سریع و آسان است. تنها کافی است کد HTML و کد سمت سرور را به برنامه خود اضافه کنید.

<iframe
  src="https://player.arvancloud.ir/index.html?config=https://arcaptcha.arvanvod.ir/vzZDAx3V6m/N3o8nYXRAy/origin_config.json"
  width="100%"
  height="400"
  style={{border: 0}}
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

## ۱. دریافت Site Key و Secret Key

پیش از افزودن ویجت، باید اطلاعات دسترسی را از [داشبورد آرکپچا](https://dashboard.arcaptcha.co/log-in) دریافت کنید:

۱. در [داشبورد آرکپچا](https://dashboard.arcaptcha.co/log-in) ثبت‌نام کنید یا وارد شوید.<br/>
۲. یک سایت جدید ایجاد کنید یا یک سایت موجود را انتخاب کنید.<br/>
۳. **site key** را کپی کنید؛ این کلید در سمت کاربر و در ویژگی `data-site-key` استفاده می‌شود.<br/>
۴. **secret key** را کپی کنید؛ این کلید در سمت سرور هنگام فراخوانی API تأیید استفاده می‌شود.

:::caution
هرگز secret key را در کد سمت کاربر یا مخازن عمومی قرار ندهید.
:::

:::info
اگر از Claude Code، Cursor یا یک agent دیگر استفاده می‌کنید، برای حرفه‌ای‌تر شدن agent خود می‌توانید از بخش [ایجنت](./agent.md) استفاده کنید.
:::

:::info
اگر از فریم‌ورک یا پلتفرمی مثل React، Vue، Laravel یا WordPress استفاده می‌کنید، کتابخانه‌ها و افزونه‌های آماده در بخش [افزونه‌ها](./plugins.md) موجود است.
:::

## ۲. نحوه کار

برای استفاده از ویجت آرکپچا نیاز است تا براساس مراحل زیر کد سمت کلاینت و سرور خود را تغییر دهید.

### سمت کاربر

۱. شما ویجت آرکپچا را در سایت خود، به عنوان مثال در یک فرم ورود کاربر که یک چالش کپچا را پاسخ می‌دهد، قرار می‌دهید.

<details>
<summary>نمونه کد سمت کاربر (ساده)</summary>

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

<summary>نمونه کد سمت کاربر (برنامه‌نویسی‌شده)</summary>

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

۲. کاربر چالش آرکپچا را تکمیل می‌کند؛ این چالش می‌تواند به‌صورت checkbox یا تعاملی باشد.<br/>
۳. آرکپچا یک توکن برمی‌گرداند که به‌عنوان `arcaptcha-token` در فرم قرار می‌گیرد.<br/>
۴. کاربر فرم را ارسال می‌کند. توکن همراه با اطلاعات فرم به سرور شما فرستاده می‌شود.

### سمت سرور

۵. سرور شما token، site key و secret key را به API تأیید آرکپچا ارسال می‌کند.

<details>
<summary>نمونه کد سمت سرور (Python / Flask)</summary>

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

۶. آرکپچا اعتبار و صحت توکن را تایید یا رد می‌کند و اعتبار آن را برای حساب شما ثبت می‌کند.<br/>
۷. سرور شما اکنون می‌داند که ارسال‌کننده درخواست یک ربات نیست و به آن اجازه ورود به سیستم را می دهد. به همین سادگی!
