# Invisible Captcha

You can get all the bot-blocking benefits of ARCaptcha without explicitly rendering our checkbox widget. ARCaptcha client/server interactions occur in the background, and the user will only be presented with a ARCaptcha challenge if try to click on submit button.

## Automatically bind the challenge to a button

The easiest way to do this is to assign an `.arcaptcha` class to any button or input. Like before, you must add your site key in a `data-site-key` attribute assigned to the `<button>` element. Additionally, all of the data-\* attributes are applicable here.

```html
<button
  class="arcaptcha"
  data-site-key="your_site_key"
  data-callback="onSubmit"
>
  Submit
</button>
```

Just as before, the `arcaptcha-token` will be sent to the callback function upon successful completion of the ARCaptcha challenge. If you attached the invisible ARCaptcha to a submit button, you must specify a data-callback to handle form submission. In most cases, you will want to use the callback to manually submit the form.

```html
<script type="text/javascript">
  function onSubmit(token) {
    cosnole.log(token); // do something with your arcaptcha-token!
    document.getElementById("my-form").submit();
  }
</script>
```

## Programmatically bind the challenge to a button or invoke the challenge

This works without change from the explicit rendering of the [ARCaptcha widget described here](/configuration#explicitly-render-arcaptcha). The only difference is that if the `data-size="invisible"` is present, the widget will be rendered in the background and only presented when a challenge is required.

## Programmatically invoke the challenge

If you would prefer to invoke the ARCaptcha workflow via a JavaScript trigger (in cases like a checkbox click, or a page load), you'll need to use the `arcaptcha.execute(widgetID)` function to trigger that process on a given `widgetID`.

For more information on the `arcaptcha.execute` function and the `widgetID` argument, you can read more on the [JavaScript API section of the configuration page](/configuration#arcaptchaexecutewidgetid)

#### Example

```html
<html>
  <head>
    <script src="https://widget.arcaptcha.co/1/api.js" async defer></script>

    <script>
      function onSubmit(token) {
        alert("thanks " + document.getElementById("field").value);
      }

      function validate(event) {
        event.preventDefault();
        if (!document.getElementById("field").value) {
          alert("You must add text to the required field");
        } else {
          arcaptcha.execute();
        }
      }

      function onload() {
        var element = document.getElementById("submit");
        element.onclick = validate;
      }
    </script>
  </head>
  <body>
    <form>
      Name: (required) <input id="field" name="field" />
      <div
        class="arcaptcha"
        data-sitekey="your_site_key"
        data-callback="onSubmit"
        data-size="invisible"
      ></div>
      <button id="submit">submit</button>
    </form>
    <script>
      onload();
    </script>
  </body>
</html>
```
