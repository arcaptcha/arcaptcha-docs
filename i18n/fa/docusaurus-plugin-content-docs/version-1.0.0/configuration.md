# پیکربندی

## پیکربندی کانتینر آرکپچا

تنها راه برای پیکربندی آرکپچا تنظیم ویژگی های سفارشی در کانتینر آرکپچا `<div>` است. قبلا این کار را با `data-site-key` انجام داده‌اید، اما تعدادی ویژگی اختیاری دیگر وجود دارد که سفارشی سازی بیشتر را امکان پذیر می کند.

| ویژگی                    | مقدار render        | مقدار                    | توضیحات                                                                                                                 |
| ------------------------ | ------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| data-site-key            | site_key            | `<your site key>`        | ضروری. sitekey عمومی شما                                                                                                |
| data-size                | size                | `normal` \| `inivisible` | اختیاری. اندازه ویجت را تنظیم کنید. پیش‌فرض `normal` است.                                                               |
| data-theme               | theme               | `light` \| `dark`        | اختیاری. تم ویجت را تنظیم کنید. پیش فرض `light` است.                                                                    |
| data-color               | color               | اسم رنگ یا کد hex        | اختیاری. رنگ هر عنصر در ویجت را تنظیم کنید.                                                                             |
| data-lang                | lang                | `en` \| `fa`             | اختیاری. تنظیم زبان ویجت به طور پیش فرض `fa` است                                                                        |
| data-error-print         | error_print         | `0` \| `1`               | اختیاری. فعال کردن یا غیر فعال کردن پیام‌های ارور در زیر چک باکس. به طور پیش فرض`0` است                                 |
| data-callback            | callback            | `<function name>`        | اختیاری. زمانی که کاربر یک پاسخ موفقیت آمیز ارسال می کند، فراخوانی می شود و `arcaptcha-token` به callback ارسال می شود. |
| data-rendered-callback   | renderd_callback    | `<function name>`        | اختیاری. این تابع پس از رندر کپچا فراخوانی می شود.                                                                      |
| data-error-callback      | error_callback      | `<function name>`        | اختیاری. این تابع پس از خطا فراخوانی می شود.                                                                            |
| data-reset-callback      | reset_callback      | `<function name>`        | اختیاری. این تابع پس از بازگذاری مجدد کپچا فراخوانی می شود.                                                             |
| data-expired-callback    | expired_callback    | `<function name>`        | اختیاری. این تابع پس از انقضا فراخوانی می شود.                                                                          |
| data-chlexpired-callback | chlexpired_callback | `<function name>`        | اختیاری. این تابع پس از انقضای چالش فراخوانی می شود.                                                                    |
| data-blocked-callback    | blocked_callback    | `<function name>`        | اختیاری. این تابع پس ازینکه کاربر به عنوان ربات تشخیص داده شد فراخوانی می‌ شود.                                         |
| data-clicked-callback    | clicked_callback    | `<function name>`        | اختیاری. این تابع پس ازینکه کاربر روی باکس کلیک کرد و یا تابع `execute` فراخوانی شد، اجرا می‌گردد.                      |
| data-opened-callback     | opened_callback     | `<function name>`        | اختیاری. این تابع بعد از باز شدن یک چالش کپچا فراخوانی می‌شود.                                                          |
| data-closed-callback     | closed_callback     | `<function name>`        | اختیاری. این تابع بعد از بسته شدن چالش کپچا توسط کاربر و یا به صورت اتوماتیک فراخوانی می‌شود.                           |

علاوه بر `data-site-key` مورد نیاز، می توانید هر تعداد یا چند ویژگی پیکربندی را که می خواهید اضافه کنید.

```html
<div
  class="arcaptcha"
  data-site-key="your_site_key"
  data-callback="onSubmit"
></div>
```

همه ویژگی‌های بالا می‌توانند به‌عنوان آرگومان‌های پارامتر هنگام رندر کردن صریح با `()arcaptcha.render`استفاده شوند (توضیح داده شده در بخش بعدی). در این حالت، نام پارامتر همانطور که در بالا نشان داده شده است، اما بدون پیشوند data است. به عنوان مثال، آرگومان پارامتر `data-site-key` به صورت `site_key` خواهد بود.

```html
<script type="text/javascript">
  arcaptcha.render("captcha-1", {
    site_key: "your_site_key",
  });
</script>
```

## JavaScript API

ARCaptcha API شیء آرکپچا را نشان می دهد که متدهایی دارد که ممکن است در سفارشی کردن آرکپچا مفید باشد.

### arcaptcha.render(container, params)

ویجت آرکپچا را در داخل عنصر DOM کانتینر ارائه می کند. یک widgetID منحصر به فرد را برای ویجت برمی گرداند.

- `container` شناسه رشته کانتینر یا عنصر DOM کانتینر.

* `params` یک شی حاوی پارامترهای پیکربندی به عنوان جفت کلید = مقدار. برای مثال :

```js
{
   size: "invisible",
   site_key: "your_site_key"
}
```

### arcaptcha.reset(widgetID)

ویجت آرکپچا را با widgetID ریست می کند.

- `widgetID` شناسه منحصر به فرد اختیاری برای یک ویجت. پیش‌فرض‌ برای اولین ویجت ایجاد می‌شود.

### arcaptcha.getArcToken(widgetID)

شناسه چالش را برای ویجت آرکپچا با widgetID دریافت می کند.

- `widgetID` شناسه منحصر به فرد اختیاری برای یک ویجت. پیش‌فرض‌ برای اولین ویجت ایجاد شده می‌باشد.

### arcaptcha.execute(widgetID)

گردش کار آرکپچا را به صورت برنامه‌ریزی شده راه اندازی می کند. به طور کلی در حالت نامرئی استفاده می شود که در آن ظرف هدف به جای یک دکمه، یک div است. یک promise را برمی‌گرداند که پس از حل چالش توسط کاربر برطرف می‌شود و پس از هر گونه خطا یا حل نادرست رد می‌شود.

- `widgetID` شناسه منحصر به فرد اختیاری برای یک ویجت. پیش‌فرض‌ برای اولین ویجت ایجاد شده می‌باشد.

```js
arcaptcha
  .execute()
  .then(({ arcaptcha_token }) => {
    console.log(arcaptcha_token);
  })
  .catch((err) => {
    console.error(err);
  });
```

## به صراحت آرکپچا را رندر کنید

در اجرای پیش‌فرض، ابزارک‌های آرکپچا به‌طور خودکار رندر می‌شوند و در صفحه وب شما درج می‌شوند. با این حال، می‌توانید رندر را با تعیین یک تابع callback که در آن ویجت را خودتان رندر می‌کنید، به تعویق بیندازید.

برای تعیین یک تابع callback، باید نام تابع را به عنوان یک ویژگی به `container` آرکپچا یا به عنوان پارامتر به تابع `render` بفرستید.

سپس می‌توانید `arcaptcha.render` را با container selector (id یا کلاس) یا `HTMLElement` و کلید سایت خود فراخوانی کنید تا ویجت را به‌صراحت رندر کنید.

```html
<script type="text/javascript">
  var yourFunction = function () {
    console.log("ARCaptcha is ready.");
    var widgetID = arcaptcha.render("captcha-1", {
      site_key: "your_site_key",
    });
  };
</script>
```

## مدیریت خطا (سمت مشتری)

با تنظیم `data-error-callback` روی ویجت ARCaptcha می‌توانید به انواع مختلف خطاهایی که ممکن است در سمت کلاینت رخ دهد، دسترسی پیدا کنید.

```html
<div
  class="arcaptcha"
  data-site-key="your_site_key"
  data-error-callback="onError"
></div>

<script>
  function onError({ code, message }) {
    console.log(code, "-", message); // '201-answer-server-error:500-خطای سرور'
  }
</script>
```

ما خطاها را مانند پروتکل HTTP با کدها دسته‌بندی کرده‌ایم:

- `1xx`: خطاهای مرحله ایجاد
- `2xx`: خطاهای مرحله پاسخ

در این جدول می‌توانید تمام خطاهای پشتیبانی شده توسط ویجت ما را مشاهده کنید:

| کد    | نام                    | توضیحات                                                         | مثال پیام                                     |
| ----- | ---------------------- | --------------------------------------------------------------- | --------------------------------------------- |
| `101` | `CREATE_SERVER_ERROR`  | زمانی که در سمت سرور ما در مرحله ایجاد خطایی رخ می‌دهد          | `create-server-error:404-Website not found`   |
| `102` | `CREATE_NETWORK_ERROR` | زمانی که کلاینت نمی‌تواند در مرحله ایجاد به سرورهای ما متصل شود | `create-network-error:Network is unreachable` |
| `201` | `ANSWER_SERVER_ERROR`  | زمانی که در سمت سرور ما در مرحله پاسخ خطایی رخ می‌دهد           | `answer-server-error:500-Server error`        |
| `202` | `ANSWER_NETWORK_ERROR` | زمانی که کلاینت نمی‌تواند در مرحله پاسخ به سرورهای ما متصل شود  | `answer-network-error:Network is unreachable` |
| `203` | `ANSWER_WRONG_ERROR`   | زمانی که کلاینت پاسخ اشتباه ارسال می‌کند                        | `answer-wrong-error`                          |
| `401` | `UNKNOWN_ERROR`        | هر خطای ناشناخته                                                | `unknown-error`                               |

## تست ادغام : کلید های تست

اگر از آرکپچا استفاده می‌کنید و قصد دارید برای نرم‌افزار خود تست بنویسید، ساده‌ترین راه برای کنار گذاشتن کپچا در محیط تست استفاده از کلیدهای مخصوص آرکپچا است که برای استفاده در چنین شرایطی تهیه شده‌اند. با استفاده از `site-key` مخصوص محیط تست، کپچا به صورت خودکار حل شده و یک مقدار خاص می‌پذیرد. دقت داشته باشید که این مقدار خاص در صورت استفاده از `secret-key` مخصوص تست تایید(verify) خواهد شد.

:::caution توجه

کلیدهای ذکر شده صرفا برای استفاده در محیط تست هستند و استفاده از آنها در محیط عملیاتی توصیه نمی‌شود. چرا که این کلیدها هیچ ویژگی تشخیص رباتی برای شما فراهم نمی‌آورند!

:::

### Test Key Set

| Test parameter    | Value                            |
| ----------------- | -------------------------------- |
| `site-key`        | `0000000000`                     |
| `secret-key`      | `00000000000000000000`           |
| `arcaptcha-token` | `000000000000000000000000000000` |
