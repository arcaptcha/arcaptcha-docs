---
sidebar_position: 1
---

# نصب و راه اندازی

ویجت آرکپچا می تواند از برنامه های شما در برابر ربات ها، هرزنامه ها و سایر اشکال سوء استفاده خودکار محافظت کند. نصب آرکپچا سریع و آسان است.تنها کافی است که کد HTML و کد سمت سرور را به برنامه خود اضافه کنید.
## مبانی و مقدمات {#مبانی-و-مقدمات}

شما ویجت آرکپچا را در سایت خود جاسازی می کنید. به عنوان مثال، در یک فرم ورود. کاربر به یک چالش آرکپچا پاسخ می دهد. آنها یک رمز عبور از سرور ما دریافت می کنند که در فرم شما تعبیه شده است. هنگامی که کاربر روی ارسال کلیک می کند، رمز عبور در فرم به سرور شما ارسال می شود. سپس سرور شما آن رمز عبور را با API سرور آرکپچا بررسی می کند. آرکپچا می گوید معتبر است و حساب شما را اعتبارسنجی می کند. سرور شما اکنون می داند که کاربر یک ربات نیست و به آن اجازه ورود به سیستم را می دهد. بسیار ساده!

![all text](/img/flow.png)

## ویجت آرکپچا را به صفحه وب خود اضافه کنید {#ویجت-آرکپچا-را-به-صفحه-وب-خود-اضافه-کنید}

آرکپچا برای ارائه یک ویجت کپچا در صفحه HTML به دو قطعه کوچک کد سمت کلاینت نیاز دارد. ابتدا باید منبع جاوا اسکریپت آرکپچا را در جایی در صفحه HTML خود قرار دهید. `<script>` باید از طریق HTTPS بارگیری شود و می تواند در هر نقطه از صفحه قرار گیرد. داخل تگ `<head>` یا بلافاصله بعد از کانتینر `arcaptcha.` هر دو خوب هستند.

```html
<script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>
```

سپس، باید یک کانتینر DOM خالی اضافه کنید که ویجت آرکپچا به طور خودکار در آن درج شود. کانتینر یک `<div>` است و باید دارای کلاس **arcaptcha** و ویژگی **data-site-key** برای کلید عمومی سایت شما باشد.

```html
<div class="arcaptcha" data-site-key="your_site_key"></div>
```
به طور معمول، شما می خواهید کانتینر خالی `arcaptcha.` را در یک فرم HTML قرار دهید. هنگامی که یک کپچا با موفقیت حل شد، یک توکن مخفی به طور خودکار به فرم شما اضافه می شود که می توانید برای تأیید به سرور خود پست کنید. می توانید آن را در سمت سرور با پارامتر POST `arcaptcha-token` بازیابی کنید.

در اینجا یک مثال کامل وجود دارد که در آن از آرکپچا برای محافظت از فرم ثبت نام در برابر سوء استفاده خودکار استفاده می شود. هنگامی که فرم ارسال شد، پس از حل شدن کپچا، `token-arcaptcha` شامل ایمیل و گذرواژه  داده‌ی POST می باشد.


```html
<html>
  <head>
    <title>ARCaptcha Demo</title>
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

## سمت سرور پاسخ کاربر را تأیید کنید {#سمت-سرور-پاسخ-کاربر-را-تأیید-کنید}

با افزودن کد سمت کلاینت، می‌توانید یک ویجت آرکپچا را ارائه دهید که مشخص می‌کند کاربران افراد واقعی یا ربات‌های خودکار هستند. وقتی کپچا موفق شد، اسکریپت آرکپچا یک نشانه منحصر به فرد را در داده های فرم شما وارد کرد.


برای تأیید واقعی و معتبر بودن توکن، اکنون باید آن را در API endpoint تأیید کنید:

```html
https://api.arcaptcha.ir/arcaptcha/api/verify
```

endpoint انتظار دارد که یک درخواست POST با دو پارامتر داشته باشد: رمز حساب شما و رمز `arcaptcha-tokena` که از HTML frontend شما برای تأیید به backend شما ارسال می شود.

لطفاً توجه داشته باشید که باید با فراخوانی `verify` با secret حساب خود اعتبار سنجی شوید: این مرحله  فرآیندی است که طی آن  حساب شما  با پاسخ مرتبط می‌شود. همچنین در صورت استفاده از secret حساب دیگری، نمی‌توانید رمز عبور را از یک sitekey در یک حساب تأیید کنید.


| پارامترهای POST | توضیحات                                                                |
| --------------- | ---------------------------------------------------------------------------- |
| challenge_id    |  ضروری. نام فیلد  `arcaptcha-token` که از فرم خود دریافت کردید|
| site_key        | ضروری. کلید سایتی که انتظار دارید ببینید.                                    |
| secret_key      | ضروری. کلید مخفی حساب شما                                          |

توکن ها فقط یک بار قابل استفاده هستند و باید در مدت زمان کوتاهی پس از صدور تأیید شوند. برای بازیابی رمز روی سرور خود، از پارامتر POST `arcaptcha-token` استفاده کنید که توسط فرم شما ارسال شده است.

```
# PSEUDO CODE

SECRET_KEY = "your_secret_key"    # replace with your secret key
SITE_KEY   = "your_site_key"    # replace with your site key
VERIFY_URL = "https://api.arcaptcha.ir/arcaptcha/api/verify"

# Retrieve token from post data with key 'arcaptcha-token'.
token = request.POST_DATA['arcaptcha-token']

# Build payload with secret key and site_key and challenge_id.
data = { 'secret_key': SECRET_KEY, 'challenge_id': token, 'site_key':SITE_KEY }

# Make POST request with data payload to ARCaptcha API endpoint.
response = http.post(url=VERIFY_URL, data=data)

# Parse JSON from response. Check for success or error codes.
response_json = JSON.parse(response.data)
success = response_json['success']
```

درخواست POST شما یک پاسخ JSON دریافت خواهد کرد. شما باید فیلد `success` را بررسی کنید و تنها در صورتی منطق کسب و کار عادی خود را اجرا کنید که `success`برابر `true` باشد.

