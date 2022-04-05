# Installation

The ARCaptcha widget can protect your applications from bots, spam, and other forms of automated abuse. Installing ARCaptcha is fast and easy. It requires either adding some simple HTML and server side code.

## Basics

You embed the ARCaptcha widget on your site. For example, on a login form. The user answers an ARCaptcha. They get a passcode from our server that is embedded in your form. When the user clicks Submit the passcode is sent to your server in the form. Your server then checks that passcode with the ARCaptcha server API. ARCaptcha says it is valid and credits your account. Your server now knows the user is not a bot and lets them log in. Pretty simple!

![all text](/img/flow.png)

## Add the ARCaptcha Widget to your Webpage

ARCaptcha requires two small pieces of client side code to render a captcha widget on an HTML page. First, you must include the ARCaptcha javascript resource somewhere in your HTML page. The `<script>` must be loaded via HTTPS and can be placed anywhere on the page. Inside the `<head>` tag or immediately after the `.arcaptcha` container are both fine.

```html
<script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>
```

Second, you must add an empty DOM container where the ARCaptcha widget will be inserted automatically. The container is a `<div>`and must have class **arcaptcha** and a **data-site-key** attribute set to your public site key.

```html
<div class="arcaptcha" data-site-key="your_site_key"></div>
```

Typically, you'll want to include the empty `.arcaptcha` container inside an HTML form. When a captcha is successfully solved, a hidden token will automatically be added to your form that you can then POST to your server for verification. You can retrieve it server side with POST parameter `arcaptcha-token`.

Here's a full example where ARCaptcha is being used to protect a signup form from automated abuse. When the form is submitted, the `arcaptcha-token` will be included with the email and password POST data after the captcha is solved.

```html
<html>
  <head>
    <title>ARCaptcha Demo</title>
    <script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>
  </head>
  <body>
    <form action="" method="POST">
      <input type="text" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <div class="arcaptcha" data-site-key="your_site_key"></div>
      <br />
      <input type="submit" value="Submit" />
    </form>
  </body>
</html>
```

## Verify the User Response Server Side

By adding the client side code, you were able to render an ARCaptcha widget that identified if users were real people or automated bots. When the captcha succeeded, the ARCaptcha script inserted a unique token into your form data.

To verify that the token is indeed real and valid, you must now verify it at the API endpoint:

```html
https://api.arcaptcha.ir/arcaptcha/api/verify
```

The endpoint expects a POST request with two parameters: your account secret and the `arcaptcha-tokena` token sent from your frontend HTML to your backend for verification.

Please note that you must call `verify` with your account secret in order to be credited: this is the step in the process that associates your account with the value of that answer. You will also be unable to validate passcodes from a sitekey in one account if using a different account's secret.

| POST Parameters | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| challenge_id    | Required. The field name `arcaptcha-token` token you received from your form |
| site_key        | Required. The sitekey you expect to see.                                     |
| secret_key      | Required. Your account secret key.                                           |

Tokens can only be used once and must be verified within a short period of time after being issued. To retrieve the token on your server, use the `arcaptcha-token` POST parameter submitted by your form.

```
# PSEUDO CODE

SECRET_KEY = "your_secret_key"    # replace with your secret key
SITE_KEY   = "your_site_key"    # replace with your site key
VERIFY_URL = "https://api.arcaptcha.ir/arcaptcha/api/verify"

# Retrieve token from post data with key 'arcaptcha-token'.
token = request.POST_DATA['arcaptcha-token']

# Build payload with secret key and site_key and challenge_id.
data = { 'secret_key': SECRET_KEY, 'challenge_id': token, 'site_key':SITE_KEY }

# Make POST request with data payload to ARCaptcha API endpoint.
response = http.post(url=VERIFY_URL, data=data)

# Parse JSON from response. Check for success or error codes.
response_json = JSON.parse(response.data)
success = response_json['success']
```

Your POST request will receive a JSON response. You should check the `success` field and only execute your normal business logic if `success` is `true`.
