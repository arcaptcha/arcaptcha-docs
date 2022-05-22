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

Response body :

| Parameters | Description                               |
| ---------- | ----------------------------------------- |
| success    | Status of challenge. Can be true or false |

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
