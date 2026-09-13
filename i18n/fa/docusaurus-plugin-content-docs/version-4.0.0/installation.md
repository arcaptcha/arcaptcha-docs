---
sidebar_position: 2
---

# نصب و راه‌اندازی

در این بخش نحوهٔ نصب آرکپچا را می‌بینید: بارگذاری اسکریپت ویجت، افزودن کانتینر کپچا به فرم‌ها و تأیید پاسخ در سمت سرور.

![جریان کار](/img/flow.png)

## ۱. افزودن ویجت ARCaptcha به صفحه وب

ARCaptcha برای نمایش ویجت کپچا در یک صفحه HTML به دو قطعه کد کوچک سمت کاربر نیاز دارد. ابتدا باید منبع جاوااسکریپت ARCaptcha را در صفحه HTML خود قرار دهید. تگ `<script>` باید از طریق HTTPS بارگذاری شود و می‌تواند در هر نقطه‌ای از صفحه قرار بگیرد؛ قرار دادن آن داخل تگ `<head>` یا بلافاصله بعد از کانتینر `.arcaptcha` هر دو مناسب هستند.

```html
<script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>

<!-- می‌توانید دامنه را به‌صورت دستی تنظیم کنید؛ برای WebViewهای موبایل کاربرد دارد -->
<script
  src="https://widget.arcaptcha.ir/1/api.js?domain=example.com"
  async
  defer
></script>
```

سپس باید یک کانتینر خالی DOM اضافه کنید تا ویجت ARCaptcha به‌صورت خودکار در آن قرار بگیرد. این کانتینر یک `<div>` است و باید کلاس **arcaptcha** و ویژگی **data-site-key** را با site key عمومی شما داشته باشد.

```html
<div class="arcaptcha" data-site-key="your_site_key"></div>
```

معمولاً باید کانتینر خالی `.arcaptcha` را داخل یک فرم HTML قرار دهید. پس از حل موفق کپچا، یک token مخفی به‌صورت خودکار به فرم اضافه می‌شود و می‌توانید آن را برای تأیید به سرور خود ارسال کنید. این token را می‌توان در سمت سرور با پارامتر POST به نام `arcaptcha-token` دریافت کرد.

نمونه کامل زیر استفاده از ARCaptcha برای محافظت از فرم ثبت‌نام در برابر سوءاستفاده خودکار را نشان می‌دهد. هنگام ارسال فرم، پس از حل کپچا، `arcaptcha-token` همراه با داده‌های POST ایمیل و گذرواژه ارسال می‌شود.

```html
<html>
  <head>
    <title>نمونه ARCaptcha</title>
    <script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>
  </head>
  <body>
    <form action="" method="POST">
      <input type="text" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <div class="arcaptcha" data-site-key="your_site_key"></div>
      <br />
      <input type="submit" value="Submit" />
    </form>
  </body>
</html>
```

## ۲. تأیید پاسخ کاربر در سمت سرور

با افزودن کد سمت کاربر، ویجت ARCaptcha را نمایش دادید تا مشخص شود کاربران افراد واقعی هستند یا ربات‌های خودکار. پس از حل موفق کپچا، اسکریپت ARCaptcha یک token منحصربه‌فرد در داده‌های فرم قرار می‌دهد.

برای اطمینان از واقعی و معتبر بودن token، باید آن را در endpoint زیر تأیید کنید:

```text
https://api.arcaptcha.co/arcaptcha/api/verify
```

این endpoint یک درخواست POST با سه پارامتر دریافت می‌کند: site key شما، secret key حساب و `arcaptcha-token` که از HTML سمت کاربر به backend فرستاده می‌شود.

توجه کنید که برای ثبت اعتبار در حساب، باید `verify` را با secret key حساب خود فراخوانی کنید. همچنین نمی‌توانید tokenهای مربوط به site key یک حساب را با secret key حساب دیگری تأیید کنید.

| پارامترهای POST | توضیحات                                                       |
| --------------- | ------------------------------------------------------------- |
| `challenge_id`  | ضروری. token دریافت‌شده از فرم با نام فیلد `arcaptcha-token`. |
| `site_key`      | ضروری. site key مورد انتظار شما.                              |
| `secret_key`    | ضروری. secret key حساب شما.                                   |

tokenها فقط یک بار قابل استفاده هستند و باید مدت کوتاهی پس از صدور تأیید شوند. برای دریافت token در سرور، از پارامتر POST `arcaptcha-token` که فرم ارسال کرده است استفاده کنید.

```python
# کد شبه‌پایتون
SECRET_KEY = "your_secret_key"  # secret key خود را جایگزین کنید
SITE_KEY = "your_site_key"  # site key خود را جایگزین کنید
VERIFY_URL = "https://api.arcaptcha.co/arcaptcha/api/verify"

# دریافت token از داده POST با کلید 'arcaptcha-token'.
token = request.POST_DATA["arcaptcha-token"]

# ساخت payload شامل secret key، site key و challenge id.
data = {
    "secret_key": SECRET_KEY,
    "challenge_id": token,
    "site_key": SITE_KEY,
}

# تنظیم هدر Content-Type روی application/json
headers = {"Content-Type": "application/json"}

# ارسال درخواست POST با payload به endpoint API آرکپچا.
response = http.post(url=VERIFY_URL, data=data, headers=headers)

# تجزیه پاسخ JSON و بررسی success یا کدهای خطا.
response_json = JSON.parse(response.data)
success = response_json["success"]
```

درخواست POST شما یک پاسخ JSON دریافت می‌کند. فیلد `success` را بررسی کنید و فقط زمانی منطق اصلی برنامه را اجرا کنید که مقدار آن `true` باشد.
