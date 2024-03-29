---
title: Verify
---

# Verifying the user's response

This page explains how to verify a user's response to a ARCaptcha challenge from your application's backend.

For web users, you can get the user’s response token in this way:

- `arcaptcha-response` POST parameter when the user submits the form on your site

- `rcaptcha.getResponse(opt_widget_id)` after the user completes the ARCaptcha challenge

- As a string argument to your `callback` function if `data-callback` is specified in either the `arcaptcha` tag attribute.

## Token Restrictions

Each ARCaptcha user response token is valid for two minutes, and can only be verified once to prevent replay attacks. If you need a new token, you can re-run the ARCaptcha verification.

After you get the response token, you need to verify it within two minutes with ARCaptcha using the following API to ensure the token is valid.

## API Request

URL: https://arcaptcha.co/3/siteverify METHOD: POST

| POST Parameter | Description                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------- |
| secret         | Required. The shared key between your site and ARCaptcha.                                         |
| response       | Required. The user response token provided by the ARCaptcha client-side integration on your site. |
| remoteip       | Optional. The user's IP address.                                                                  |

## API Response

The response is a JSON object:

```json
{
  "success": true|false,
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "hostname": string,         // the hostname of the site where the ARCaptcha was solved
  "error-codes": [...]        // optional
}
```

## Error code reference

| Error code             | Description                                                                     |
| ---------------------- | ------------------------------------------------------------------------------- |
| missing-input-secret   | The secret parameter is missing.                                                |
| invalid-input-secret   | The secret parameter is invalid or malformed.                                   |
| missing-input-response | The response parameter is missing.                                              |
| invalid-input-response | The response parameter is invalid or malformed.                                 |
| bad-request            | The request is invalid or malformed.                                            |
| timeout-or-duplicate   | The response is no longer valid: either is too old or has been used previously. |
