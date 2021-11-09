# Configuration

## ARCaptcha Container Configuration

The only way to configure ARCaptcha is to set custom attributes on the ARCaptcha container `<div>`. You're already required to do this with `data-site-key`, but there are a handful of other optional attributes that enable more customization.

| Attribute     | Value                | Description                                                                                                           |
| ------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| data-site-key | `<your site key>`    | Required. Your public API site key.                                                                                   |
| data-size     | normal \| inivisible | Optional. Set the size of the widget. Defaults to normal.                                                             |
| data-callback | `<function name>`    | Optional. Called when the user submits a successful response. The `arcaptcha-token` token is passed to your callback. |

Besides the required `data-site-key`, you can add as many or as few configuration attributes as you want.

```html
<div
  class="arcaptcha"
  data-site-key="your_site_key"
  data-callback="onSubmit"
></div>
```

All of the above attributes can also be used as param arguments when explicitly rendering with `arcaptcha.render()` (described in the next section). In that case, the param name is as shown above, but without the data prefix. For example, the param argument for `data-site-key` is just `site-key`

```html
<script type="text/javascript">
  arcaptcha.render("captcha-1", {
    "site-key": "your_site_key",
  });
</script>
```

## JavaScript API

The ARCaptcha API exposes the ARCaptcha object that has methods you may find useful in customizing ARCaptcha behavior.

### arcaptcha.render(container, params)

Renders the ARCaptcha widget inside the container DOM element. Returns a unique widgetID for the widget.

- `container` The string ID of the container or the container DOM element.

* `params` An object containing config parameters as key=value pairs. Ex:

```js
{
   "size": "invisible",
   "site-key": "your_site_key"
}
```

### arcaptcha.reset(widgetID)

Resets the ARCaptcha widget with widgetID.

- `widgetID` Optional unique ID for a widget. Defaults to first widget created.

### arcaptcha.getArcToken(widgetID)

Gets the challenge ID for the ARCaptcha widget with widgetID.

- `widgetID` Optional unique ID for a widget. Defaults to first widget created.

### arcaptcha.execute(widgetID)

Triggers the ARCaptcha workflow programmatically. Generally used in invisible mode where the target container is a div rather than a button.

- `widgetID` Optional unique ID for a widget. Defaults to first widget created.

## Explicitly Render ARCaptcha

In the default implementation, ARCaptcha widgets will be automatically rendered and inserted into your webpage. However, you can also defer rendering by specifying a custom onload callback function in which you render the widget yourself.

To specify a custom onload callback function, you must pass the function name as an attribute into ARCaptcha `container` or as a parameter into `render` function.

You can then call `arcaptcha.render` with the container selector(id or class) or `HTMLElement` and your site key to explicitly render the widget.

```html
<script type="text/javascript">
  var yourFunction = function () {
    console.log("ARCaptcha is ready.");
    var widgetID = arcaptcha.render("captcha-1", {
      "site-key": "your_site_key",
    });
  };
</script>
```
