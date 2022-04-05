# تأیید کنید

توضیحات: بررسی کنید که کاربر چالش را به درستی حل کرده است.

روش: `POST`.

نقطه پایانی : `https://api.arcaptcha.ir/arcaptcha/api/verify`

درخواست پارامترها:

| پارامترها    | توضیحات                                                                 |
| ------------ | ---------------------------------------------------------------------------- |
| challenge_id | ضروری. نام فیلد  که از فرم خود دریافت کردید |
| site_key     | ضروری. کلید سایتی که انتظار دارید ببینید.                                     |
| secret_key   | ضروری. کلید مخفی حساب شما                                         |

بدنه پاسخ :

| پارامترها | توضیحات                           |
| ---------- | ----------------------------------------- |
| success    | وضعیت چالش می تواند درست یا نادرست باشد |

مثال(NodeJS) :

```js
const arcaptcha_api = "https://api.arcaptcha.ir/arcaptcha/api/verify";

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
