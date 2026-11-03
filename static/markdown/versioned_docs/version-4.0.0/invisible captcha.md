# Invisible Widget

An **Invisible Widget** removes the visible “I'm not a robot” checkbox. It does not remove ARCaptcha's bot-detection process or mean that every request is automatically trusted.

When the user clicks a bound button—or your code calls `arcaptcha.execute()`—ARCaptcha starts bot detection:

- If ARCaptcha decides no human challenge is needed, verification completes without interrupting the user. Your callback receives the token.
- If ARCaptcha decides an extra human check is needed, it opens the challenge as a pop-up. After the user completes it, your callback receives the token.

The caller handles the token the same way in either case: submit it to your backend and verify it with the [ARCaptcha Verify API](./API/Verify.md).

> **Info: Not a score-only CAPTCHA mode**
>
> Invisible Widget is not a reCAPTCHA v3-style score integration. Your application does not receive a risk score to interpret. ARCaptcha runs its detection flow and either completes without showing a challenge or asks the user to solve a pop-up challenge.

## Bind an Invisible Widget to a button

Add the `.arcaptcha` class and your public site key to a button. Set `data-size="invisible"` to hide the checkbox UI:

```html
<form id="signup-form" action="/signup" method="POST">
  <input name="email" type="email" required />
  <button
    class="arcaptcha"
    data-site-key="YOUR_SITE_KEY"
    data-size="invisible"
    data-callback="onVerified"
  >
    Continue
  </button>
</form>

<script>
  function onVerified(token) {
    // The widget has completed, with or without showing a challenge.
    document.getElementById("signup-form").submit();
  }
</script>
```

The widget starts its detection flow when the button is clicked. If no challenge is needed, the user sees no CAPTCHA step. If a challenge is needed, the pop-up appears before `onVerified` runs.

## Trigger detection programmatically

Use `size: "invisible"` when rendering a widget in a container, then call `arcaptcha.execute(widgetID)` at the action you want to protect:

```html
<div id="captcha-container"></div>
<button id="continue-button">Continue</button>

<script>
  const widgetID = arcaptcha.render("#captcha-container", {
    site_key: "YOUR_SITE_KEY",
    size: "invisible",
    callback: onVerified,
  });

  document.getElementById("continue-button").addEventListener("click", (event) => {
    event.preventDefault();
    arcaptcha.execute(widgetID);
  });

  function onVerified(token) {
    // Send token to your server, then submit the protected action.
  }
</script>
```

Calling `execute()` starts detection; it does not guarantee that a visible challenge will appear. The user may see no interruption or may be asked to solve the pop-up challenge.

## Server verification is still required

After the callback receives `arcaptcha-token`, send it to your backend. The backend must call the Verify API with your site key, secret key, and token as `challenge_id`. Never treat the client callback alone as authorization, and never expose the secret key in browser code.

See [Configuration](./configuration.md) for the JavaScript API and widget attributes, and [Installation](./installation.md) for the standard script and backend verification setup.
