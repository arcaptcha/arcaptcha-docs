
# Verifying the user's response 

This page explains how to verify a user's response to a ARCaptcha challenge from your application's backend.

For web users, you can get the user’s response token in one of three ways:
<ul>
<li> `arcaptcha-response` POST parameter when the user submits the form on your site </li>
<li> `grecaptcha.getResponse(opt_widget_id)`  این باید به یه چی لینک بشه after the user completes the ARCaptcha challenge </li>
<li> As a string argument to your `callback` اینم لینک داره function if `data-callback` is specified in either the `g-arcaptcha` tag attribute or the callback parameter in the `garcaptcha.render` method </li>
</ul>

?????????/For Android library users, you can call the SafetyNetApi.RecaptchaTokenResult.getTokenResult() method to get response token if the status returns successful.?????????

## Token Restrictions
Each ARCaptcha user response token is valid for two minutes, and can only be verified once to prevent replay attacks. If you need a new token, you can re-run the ARCaptcha verification.

After you get the response token, you need to verify it within two minutes with ARCaptcha using the following API to ensure the token is valid.

## API Request

URL: https://arcaptcha.ir/3/siteverify METHOD: POST

| POST Parameter    | Description                                                                                           
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| secret | Required. The shared key between your site and ARCaptcha. |
| response  | 	Required. The user response token provided by the ARCaptcha client-side integration on your site. |
| remoteip | Optional. The user's IP address. |

## API Response
The response is a JSON object:

```json
{
  "success": true|false,
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
  "error-codes": [...]        // optional
}
```

For ARCaptcha Android:

```json
{
  "success": true|false,
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "apk_package_name": string, // the package name of the app where the reCAPTCHA was solved
  "error-codes": [...]        // optional
}

```

## Error code reference

| Error code  | 	Description                                                                                          
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| missing-input-secret | The secret parameter is missing. |
| invalid-input-secret  | The secret parameter is invalid or malformed. |
| missing-input-response | The response parameter is missing. |
| invalid-input-response | The response parameter is invalid or malformed. |
| bad-request | The request is invalid or malformed. |
| timeout-or-duplicate | The response is no longer valid: either is too old or has been used previously.|




