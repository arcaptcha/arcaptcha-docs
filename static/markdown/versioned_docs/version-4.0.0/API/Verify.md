# Verify

Description : Verify that user solved the challenge correctly.

Method : `POST`

Endpoint : `https://api.arcaptcha.co/arcaptcha/api/verify`

Request parameters :

| Parameters   | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| challenge_id | Required. The field name `arcaptcha-token` token you received from your form |
| site_key     | Required. The sitekey you expect to see.                                     |
| secret_key   | Required. Your account secret key.                                           |

**Important: Don't forget to set `Content-Type: application/json` in your request.**

Response body :

| Parameters            | Description                               |
| --------------------- | ----------------------------------------- |
| success               | Status of challenge. Can be true or false |
| error-codes(optional) | A brief description about possible errors |

Example(NodeJS) :

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

## Error code reference

| Error code             | Description                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------- |
| missing-input-sitekey  | The `site_key` parameter is missing.                                                  |
| missing-input-secret   | The `secret_key` parameter is missing.                                                |
| missing-input-response | The `challenge_id` is missing.                                                        |
| bad-request            | The request is invalid or malformed.                                                  |
| invalid-input-sitekey  | The `site_key` parameter is invalid or malformed.                                     |
| invalid-input-secret   | The `secret_key` parameter is invalid or malformed.                                   |
| invalid-input-response | The `challenge_id` parameter is invalid or malformed.                                 |
| timeout-or-duplicate   | The `challenge_id` is no longer valid: either is too old or has been used previously. |
