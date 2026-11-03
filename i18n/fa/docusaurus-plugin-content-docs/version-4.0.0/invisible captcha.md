# ویجت نامرئی

**ویجت نامرئی** کادر قابل‌مشاهده «من ربات نیستم» را حذف می‌کند؛ اما فرایند تشخیص بات در ARCaptcha همچنان اجرا می‌شود و به معنی اعتماد خودکار به همه درخواست‌ها نیست.

با کلیک کاربر روی دکمه متصل‌شده یا فراخوانی `arcaptcha.execute()` از کد شما، تشخیص بات شروع می‌شود:

- اگر ARCaptcha تشخیص دهد که نیازی به چالش انسانی نیست، بررسی بدون وقفه برای کاربر کامل می‌شود و callback توکن را دریافت می‌کند.
- اگر ARCaptcha به بررسی انسانی بیشتری نیاز داشته باشد، چالش را به‌شکل پنجره بازشو نمایش می‌دهد. پس از حل چالش، callback توکن را دریافت می‌کند.

در هر دو حالت، توکن را به backend بفرستید و با [Verify API آرکپچا](./API/Verify.md) بررسی کنید.

:::info این حالت کپچای امتیازمحور نیست
ویجت نامرئی مانند اتصال امتیازمحور reCAPTCHA v3 نیست. برنامه شما risk score دریافت نمی‌کند تا آن را تفسیر کند. ARCaptcha فرایند تشخیص را اجرا می‌کند و یا بدون نمایش چالش آن را کامل می‌کند، یا از کاربر می‌خواهد چالش بازشو را حل کند.
:::

## اتصال ویجت نامرئی به دکمه

کلاس `.arcaptcha` و site key عمومی خود را به دکمه اضافه کنید. ویژگی `data-size="invisible"` رابط checkbox را پنهان می‌کند:

```html
<form id="signup-form" action="/signup" method="POST">
  <input name="email" type="email" required />
  <button
    class="arcaptcha"
    data-site-key="YOUR_SITE_KEY"
    data-size="invisible"
    data-callback="onVerified"
  >
    Continue
  </button>
</form>

<script>
  function onVerified(token) {
    // ویجت بررسی را کامل کرده است؛ چه چالشی نمایش داده شده باشد و چه نه.
    document.getElementById("signup-form").submit();
  }
</script>
```

با کلیک روی دکمه، ویجت فرایند تشخیص را آغاز می‌کند. اگر چالشی لازم نباشد، کاربر مرحله‌ای از کپچا نمی‌بیند. اگر لازم باشد، پنجره چالش پیش از اجرای `onVerified` باز می‌شود.

## شروع تشخیص با کدنویسی

ویجت را داخل یک container با `size: "invisible"` رندر کنید و `arcaptcha.execute(widgetID)` را هنگام انجام عملی که می‌خواهید محافظت شود فراخوانی کنید:

```html
<div id="captcha-container"></div>
<button id="continue-button">Continue</button>

<script>
  const widgetID = arcaptcha.render("#captcha-container", {
    site_key: "YOUR_SITE_KEY",
    size: "invisible",
    callback: onVerified,
  });

  document.getElementById("continue-button").addEventListener("click", (event) => {
    event.preventDefault();
    arcaptcha.execute(widgetID);
  });

  function onVerified(token) {
    // توکن را به سرور بفرستید و سپس عملیات محافظت‌شده را ادامه دهید.
  }
</script>
```

فراخوانی `execute()` فرایند تشخیص را آغاز می‌کند؛ نمایش چالش را تضمین نمی‌کند. ممکن است کاربر هیچ وقفه‌ای نبیند یا لازم باشد چالش بازشو را حل کند.

## تأیید سمت سرور همچنان ضروری است

پس از دریافت `arcaptcha-token` در callback، آن را به backend ارسال کنید. backend باید Verify API را با site key، secret key و token در پارامتر `challenge_id` فراخوانی کند. callback سمت کلاینت به‌تنهایی مجوز انجام عملیات نیست و secret key نباید در کد مرورگر قرار بگیرد.

برای API جاوااسکریپت و ویژگی‌های ویجت به [پیکربندی](./configuration.md) و برای بارگذاری اسکریپت و تأیید backend به [نصب و راه‌اندازی](./installation.md) مراجعه کنید.
