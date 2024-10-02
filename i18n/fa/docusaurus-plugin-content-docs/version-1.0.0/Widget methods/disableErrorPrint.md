# disableErrorPrint(value)

_غیرفعال یا فعال کردن چاپ خطا در پایین جعبه کپچا_

| پارامترها | نوع       | مقدار پیش‌فرض | توضیحات                                                     |
| --------- | --------- | ------------- | ----------------------------------------------------------- |
| value     | `Boolean` | `true`        | چاپ خطا می‌تواند با تنظیم این پارامتر به `true` غیرفعال شود |

### مثال:

```js
window.arcaptcha.disableErrorPrint(); // غیرفعال کردن چاپ

window.arcaptcha.disableErrorPrint(false); // فعال کردن چاپ
```