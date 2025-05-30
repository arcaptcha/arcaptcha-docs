# disableErrorPrint(value)

** Deprecated: Please refer to [this](/configuration#arcaptcha-container-configuration) section instead of using this function and use `data-error-print` to disable this feature.**

_Disable or Enable error printed bottom of the captcha box_

| Parameters | Type      | Default | Description                                                        |
| ---------- | --------- | ------- | ------------------------------------------------------------------ |
| value      | `Boolean` | `true`  | Error printing can be disabled by setting this parameter to `true` |

### Example:

```js
window.arcaptcha.disableErrorPrint(); // disable printing

window.arcaptcha.disableErrorPrint(false); //enable printing
```
