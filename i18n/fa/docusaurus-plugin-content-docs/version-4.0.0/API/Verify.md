# تأیید کنید

توضیحات: بررسی کنید که کاربر چالش را به درستی حل کرده است.

روش: `POST`.

نقطه پایانی : `https://api.arcaptcha.co/arcaptcha/api/verify`

درخواست پارامترها:

| پارامترها    | توضیحات                                    |
| ------------ | ------------------------------------------ |
| challenge_id | ضروری. نام فیلد که از فرم خود دریافت کردید |
| site_key     | ضروری. کلید سایتی که انتظار دارید ببینید.  |
| secret_key   | ضروری. کلید مخفی حساب شما                  |

**مهم: لطفا دقت کنید نوع درخواست شما از جنس `JSON` باشد. به این منظور بایستی مقدار هدر `Content-Type` در درخواست شما `application/json` ست شده باشد**

بدنه پاسخ :

| پارامترها            | توضیحات                                 |
| -------------------- | --------------------------------------- |
| success              | وضعیت چالش می تواند درست یا نادرست باشد |
| error-codes(اختیاری) | توضیحات خلاصه در مورد خطاهای احتمالی    |

مثال(NodeJS) :

```js
const arcaptcha_api = "https://api.arcaptcha.co/arcaptcha/api/verify";

const result = await axios.post(arcaptcha_api, {
  challenge_id: req.body["arcaptcha-token"],
  site_key: "SITE_KEY",
  secret_key: "SECRET_KEY",
});
if (result.data.success) {
  // its OK
} else {
  // throw Error
}
```

## مرجع کد خطا

| Error code             | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| missing-input-sitekey  | پارامتر `site_key` وجود ندارد                                 |
| missing-input-secret   | پارامتر `secret_key` وجود ندارد                               |
| missing-input-response | پارامتر `challenge_id` وجود ندارد                             |
| bad-request            | درخواست نامعتبر و یا دستکاری شده‌است                          |
| invalid-input-sitekey  | پارامتر `site_key` نامعتبر و یا دستکاری شده‌است.              |
| invalid-input-secret   | پارامتر `secret_key` نامعتبر و یا دستکاری شده‌است.            |
| invalid-input-response | پارامتر `challenge_id` نامعتبر و یا دستکاری شده‌است.          |
| timeout-or-duplicate   | پاسخ چالش معتبر نیست: یا منقضی شده و یا قبلا استفاده شده است. |
