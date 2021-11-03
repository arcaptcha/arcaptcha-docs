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
