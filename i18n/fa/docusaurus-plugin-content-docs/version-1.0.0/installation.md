---
sidebar_position: 1
---

# نصب و راه اندازی

آرکپچا می‌تواند از سرویس‌ها و برنامه‌های شما در برابر ربات‌ها، هرزنامه‌ها و سایر آسیب‌های خودکار محافظت کند. نصب آرکپچا سریع و آسان است. تنها کافی است کد HTML و کد سمت سرور را به برنامه خود اضافه کنید.


## مبانی و مقدمات

شما ویجت آرکپچا را در سایت خود قرار می‌دهید. به عنوان مثال، در یک فرم ورود کاربر به یک چالش کپچا پاسخ می‌دهد سپس یک توکن از سمت سرور ما ایجاد می‌شود و در فرم قرار می‌گیرد. هنگامی که کاربر روی ارسال کلیک کند، رمز عبور در فرم به سرور شما ارسال می‌شود. سپس سرور شما آن توکن را با API سرور آرکپچا چک می‌کند و پاسخ این درخواست، اعتبار و صحت توکن را تایید یا رد می‌کند. سرور شما اکنون می‌داند که ارسال‌کننده درخواست یک ربات نیست و به آن اجازه ورود به سیستم را می دهد. بسیار ساده!

![all text](/img/flow.png)

## ویجت آرکپچا را به صفحه وب خود اضافه کنید

برای نمایش و استفاده از ویجت آرکپچا در صفحه HTML مورد نظر به دو قطعه کد کوچک سمت کاربر نیاز است. ابتدا باید کد جاوا اسکریپت آرکپچا را در جایی از صفحه HTML خود قرار دهید. `<script>` باید از طریق HTTPS بارگیری شود و می تواند در هر نقطه از صفحه قرار گیرد. داخل تگ `<head>` یا بلافاصله بعد از کانتینر `arcaptcha.` هر دو خوب هستند.

```html
<script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>
```

سپس، باید یک کانتینر DOM خالی اضافه کنید که ویجت آرکپچا به طور خودکار در آن درج شود. کانتینر یک `<div>` است و باید دارای کلاس **arcaptcha** و ویژگی **data-site-key** برای کلید عمومی سایت شما باشد.

```html
<div class="arcaptcha" data-site-key="your_site_key"></div>
```
به طور معمول، شما می خواهید کانتینر خالی `arcaptcha.` را در یک فرم HTML قرار دهید. هنگامی که یک کپچا با موفقیت حل شد، یک توکن مخفی به طور خودکار به فرم شما اضافه می شود که می توانید برای تأیید به سرور خود ارسال کنید. می‌توانید آن را در سمت سرور با پارامتر POST `arcaptcha-token` بازیابی کنید.
 
در اینجا یک مثال کامل وجود دارد که در آن از آرکپچا برای محافظت از فرم ثبت‌نام در برابر خرابکاری‌های خودکار استفاده می‌شود. پس از حل شدن کپچا هنگامی که فرم ارسال شود، `token-arcaptcha` به همراه اطلاعات ایمیل و گذرواژه فرم ارسال (POST) می‌شود.


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

## پاسخ کاربر را سمت سرور تایید کنید 

با افزودن کد سمت کلاینت، می‌توانید ویجت آرکپچا را نمایش دهید و کاربر را به چالش بکشید که مشخص می‌کند کاربران افراد واقعی یا ربات‌های خودکار هستند. زمانی که کپچا به طور موفق حل شد، اسکریپت آرکپچا یک توکن منحصر به فرد را در داده های فرم شما وارد می‌کند.

برای تأیید واقعی و معتبر بودن توکن، اکنون باید آن را در API endpoint زیر تایید کنید:

```html
https://api.arcaptcha.co/arcaptcha/api/verify
```
این endpoint انتظار یک درخواست POST با سه پارامتر را دارد. site_key، secret key و challenge id یعنی همان `arcaptcha-token` که از frontend شما برای تأیید به backend ارسال می‌شود.

لطفن توجه داشته باشید که باید با فراخوانی `verify` با کلید عمومی و  خصوصی حساب خود اعتبارسنجی را انجام دهید: این مرحله فرآیندی است که طی آن حساب شما با پاسخ کپچا مرتبط می‌شود.


| پارامترهای POST | توضیحات                                                                |
| --------------- | ---------------------------------------------------------------------------- |
| challenge_id    |  ضروری. نام فیلد  `arcaptcha-token` که از فرم خود دریافت کردید|
| site_key        | ضروری. کلید سایتی که انتظار دارید ببینید.                                    |
| secret_key      | ضروری. کلید مخفی حساب شما                                          |

توکن ها فقط یک بار قابل استفاده هستند و باید در مدت زمان کوتاهی پس از صدور تایید شوند. برای بازیابی توکن سمت سرور خود، از پارامتر `arcaptcha-token` استفاده کنید که توسط فرم شما ارسال شده است.

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

