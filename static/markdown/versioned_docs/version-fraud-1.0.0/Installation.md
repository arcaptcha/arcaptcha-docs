# Installation

## Sign up and Integrate

First try to reigster in ARCaptcha and create a website. After creating website you should have a token called `SITE_KEY`.

After that, you must include the ARCaptcha javascript resource somewhere in your HTML page. The `<script>` must be loaded via HTTPS and can be placed anywhere on the page.

```html
<script
  src="https://widget.arcaptcha.co/3/api.js?fraud=true&site_key=YOUR_SITE_KEY"
  defer
></script>
```

_**Note**: Don't forget to replace your SITE_KEY with YOUR_SITE_KEY in url !_
