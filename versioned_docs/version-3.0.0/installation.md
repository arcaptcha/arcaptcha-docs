# ARCaptcha v3

ARCaptcha v3 returns a score for each request without user friction. The score is based on interactions with your site and enables you to take an appropriate action for your site. Register ARCaptcha v3 keys [here](https://arcaptcha.ir/).

This page explains how to enable and customize ARCaptcha v3 on your webpage.

## Placement on your website

ARCaptcha v3 will never interrupt your users, so you can run it whenever you like without affecting conversion. ARCaptcha works best when it has the most context about interactions with your site, which comes from seeing both legitimate and abusive behavior. For this reason, we recommend including ARCaptcha verification on forms or actions as well as in the background of pages for analytics.

:::note
Note: ARCaptcha tokens expire after two minutes. If you're protecting an action with ARCaptcha, make sure to call execute when the user takes the action rather than on page load.
:::

You can execute ARCaptcha on as many actions as you want on the same page.

## Automatically bind the challenge to a button

The easiest method for using ARCaptcha v3 on your page is to include the necessary JavaScript resource and add a few attributes to your html button.

1. Load the JavaScript API.

```html
<script src="https://widget.arcaptcha.ir/3/api.js" async defer></script>
```

2. Add a callback function to handle the token.

```html
<script>
  function onSubmit(token) {
    document.getElementById("demo-form").submit();
  }
</script>
```

3. Add attributes to your html button.

```html
<button
  class="arcaptcha"
  data-sitekey="ARCaptcha_site_key"
  data-callback="onSubmit"
  data-action="submit"
>
  Submit
</button>
```

## Programmatically invoke the challenge

If you wish to have more control over when ARCaptcha runs, you can use the `execute` method in `arcaptcha` object. To do this, you need to add a `render` parameter to the ARCaptcha script load.

1. Load the JavaScript API with your sitekey.

```html
<script src="https://widget.arcaptcha.ir/3/api.js?render=ARCaptcha_site_key"></script>
```

2. Call `rcaptcha.execute` on each action you wish to protect.

```html
<script>
  function onClick(e) {
    e.preventDefault();
    rcaptcha.ready(function () {
      rcaptcha
        .execute("ARCaptcha_site_key", { action: "submit" })
        .then(function (token) {
          // Add your logic to submit to your backend server here.
        });
    });
  }
</script>
```

3. Send the token immediately to your backend with the request to [verify](/3.0.0/verify).

## Interpreting the score

ARCaptcha v3 returns a score (1.0 is very likely a good interaction, 0.0 is very likely a bot). Based on the score, you can take variable action in the context of your site. Every site is different, but below are some examples of how sites use the score. As in the examples below, take action behind the scenes instead of blocking traffic to better protect your site.

| Use case   | Recommendation                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| homepage   | See a cohesive view of your traffic on the admin console while filtering scrapers.                             |
| login      | With low scores, require 2-factor-authentication or email verification to prevent credential stuffing attacks. |
| social     | Limit unanswered friend requests from abusive users and send risky comments to moderation.                     |
| e-commerce | Put your real sales ahead of bots and identify risky transactions.                                             |

ARCaptcha learns by seeing real traffic on your site. For this reason, scores in a staging environment or soon after implementing may differ from production. As ARCaptcha v3 doesn't ever interrupt the user flow, you can first run ARCaptcha without taking action and then decide on thresholds by looking at your traffic in the admin console. By default, you can use a threshold of 0.5.

## Site Verify Response

Make the request to [verify the response token](/3.0.0/verify) as with ARCaptcha v2 or Invisible ARCaptcha.

The response is a JSON object:

```js
{
  "success": true|false,      // whether this request was a valid ARCaptcha token for your site
  "score": number             // the score for this request (0.0 - 1.0)
  "action": string            // the action name for this request (important to verify)
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "hostname": string,         // the hostname of the site where the ARCaptcha was solved
  "error-codes": [...]        // optional
}
```

## Tips

1. `rcaptcha.ready()` runs your function when the ARCaptcha library loads. To avoid race conditions with the api.js, include the api.js before your scripts that call arcaptcha, or continue to use the onload callback that's defined with the v2 API.
2. Try hooking the `execute` call to interesting or sensitive actions like Register, Password Reset, Purchase, or Play.
