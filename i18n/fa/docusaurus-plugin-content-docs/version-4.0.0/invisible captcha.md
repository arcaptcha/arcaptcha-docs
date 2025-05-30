# کپچا مخفی

می‌توانید از قابلیت جلوگیری و دفع بات‌های مخرب توسط آرکپچا، بدون نمایش ویجت «من ربات نیستم» استفاده کنید! تعاملات کلاینت/سرور آرکپچا در پس‌زمینه رخ می‌دهد و تنها در صورتی که روی دکمه ارسال (یا هر Action دیگر) کلیک شود، چالش آرکپچا به کاربر نمایش داده می‌شود.

## چالش را به صورت خودکار به یک دکمه متصل کنید

ساده ترین راه برای انجام این کار، اختصاص یک کلاس `arcaptcha.` به هر دکمه یا فیلد ورود (input) است. مانند قبل، باید کلید سایت خود را در ویژگی `data-site-key` که به عنصر `<button>` اختصاص داده شده است، اضافه کنید. علاوه بر این، تمام ویژگی های \*-data (برای تغییر قالب، رنگ و زبان) در اینجا قابل اجرا هستند.

```html
<button
  class="arcaptcha"
  data-site-key="your_site_key"
  data-callback="onSubmit"
>
  Submit
</button>
```

دقیقاً مانند قبل، `arcaptcha-token` پس از تکمیل موفقیت آمیز چالش آرکپچا به تابع callback ارسال می شود. اگر آرکپچا مخفی را به یک دکمه ارسال متصل کنید، باید یک data-callback را برای رسیدگی به ارسال فرم مشخص کنید. در بیشتر موارد، شما می خواهید از callback برای ارسال دستی فرم استفاده کنید.

```html
<script type="text/javascript">
  function onSubmit(token) {
    cosnole.log(token); // do something with your arcaptcha-token!
    document.getElementById("my-form").submit();
  }
</script>
```

## چالش را با کدنویسی به یک دکمه متصل کنید یا چالش را فراخوانی کنید

این بدون تغییر رندر صریح [ویجت آرکپچا در اینجا توضیح داده شده است ](/configuration#explicitly-render-arcaptcha)کار می کند.تنها تفاوت این است که اگر `data-size="invisible"` موجود باشد، ویجت در پس‌زمینه نمایش داده می‌شود و تنها زمانی ارائه می‌شود که چالش مورد نیاز باشد.

## با کدنویسی چالش را فراخوانی کنید

اگر ترجیح می‌دهید روند کار آرکپچا را از طریق یک تریگر (trigger) جاوا اسکریپت فراخوانی کنید (در مواردی مانند کلیک باکس یا بارگذاری صفحه)، باید از تابع `arcaptcha.execute(widgetID)` برای راه‌اندازی آن فرآیند روی یک `widgetID` استفاده کنید.

برای اطلاعات بیشتر در مورد تابع `arcaptcha.execute` و آرگومان `widgetID`، می توانید به [بخش API جاوا اسکریپت در صفحه پیکربندی](/configuration#arcaptchaexecutewidgetid) مراجعه کنید.

#### مثال

```html
<html>
  <head>
    <script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>

    <script>
      function onSubmit(token) {
        alert("thanks " + document.getElementById("field").value);
      }

      function validate(event) {
        event.preventDefault();
        if (!document.getElementById("field").value) {
          alert("You must add text to the required field");
        } else {
          arcaptcha.execute();
        }
      }

      function onload() {
        var element = document.getElementById("submit");
        element.onclick = validate;
      }
    </script>
  </head>
  <body>
    <form>
      Name: (required) <input id="field" name="field" />
      <div
        class="arcaptcha"
        data-site-key="your_site_key"
        data-callback="onSubmit"
        data-size="invisible"
      ></div>
      <button id="submit">submit</button>
    </form>
    <script>
      onload();
    </script>
  </body>
</html>
```
