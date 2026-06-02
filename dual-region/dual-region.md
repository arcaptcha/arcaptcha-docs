# ARCaptcha Dual-Region Integration Guide

If you serve users both inside Iran and abroad, a single ARCaptcha endpoint may not be enough. Cross-border internet paths are often unstable: users outside Iran may struggle to reach services hosted only in Iran, and users in Iran may face slow or blocked routes to infrastructure abroad. That shows up as failed widget loads, timeouts, or verify errors even when your application itself is healthy.

ARCaptcha dual-region integration is built for this case. You keep one integration on your site, and ARCaptcha routes each end user to the cluster closest to them. Users in Iran use the **Iran cluster**; users in every other country use the **foreign cluster** (EU region). Your backend then verifies each challenge against the matching cluster using the `challenge_id` prefix and your server location.

Use this approach when:

- You have customers or visitors in **foreign countries**, not only in Iran
- You see **connectivity issues** between Iran and international networks (latency, packet loss, filtering, or intermittent reachability)
- You want captcha traffic to stay on paths that work reliably for each user, without maintaining separate products or site keys per region

| End-user location | Handled by |
|-------------------|------------|
| Iran (IR) | Iran cluster |
| All other countries | Foreign cluster (EU region) |

You must do two things: load the widget from the unified URL, and verify challenges on the correct API based on `challenge_id` and where **your backend** runs.

---

## Overview

```
┌─────────────┐     widget.arcaptcha.net      ┌──────────────────┐
│   Browser   │ ────────────────────────────► │  ARCaptcha CDN   │
│  (end user) │                               │  (auto region)   │
└──────┬──────┘                               └──────────────────┘
       │ challenge_id (eu-* or other)
       ▼
                                              ┌──────────────────┐
┌─────────────┐     verify API (your choice)  │ Iran or foreign  │
│ Your server │ ────────────────────────────► │     cluster      │
└─────────────┘                               └──────────────────┘
```

---

## Step 1: Load the widget

Always use this script URL:

```html
<script src="https://widget.arcaptcha.net/1/api.js" async defer></script>
```

The widget detects the end user's region. Challenges from the foreign cluster are prefixed with `eu-`.

---

## Step 2: Verify on the correct API

After the user completes the captcha, your backend receives the `arcaptcha-token` value from the frontend. Send it to the verify API as `challenge_id`. Choose the verify URL as follows:

```
challenge_id starts with "eu-"?
│
├─ YES ─ Is your server outside Iran?
│        │
│        ├─ YES → https://api.arcaptcha.net/arcaptcha/api/verify
│        │
│        └─ NO (server in Iran) → https://eu-api.arcaptcha.net/arcaptcha/api/verify
│             (your server in Iran must be able to reach the foreign cluster)
│
└─ NO → https://api.arcaptcha.ir/arcaptcha/api/verify
```

| Condition | Verify URL |
|-----------|------------|
| `challenge_id` does **not** start with `eu-` | `https://api.arcaptcha.ir/arcaptcha/api/verify` |
| `challenge_id` starts with `eu-`, server **outside** Iran | `https://api.arcaptcha.net/arcaptcha/api/verify` |
| `challenge_id` starts with `eu-`, server **inside** Iran | `https://eu-api.arcaptcha.net/arcaptcha/api/verify` |

---

## Python example

Set `SERVER_IN_IRAN=true` when your backend runs inside Iran; otherwise leave it unset or `false`.

```python
import os
import requests

SECRET_KEY = os.environ["ARCAPTCHA_SECRET_KEY"]
SERVER_IN_IRAN = os.environ.get("SERVER_IN_IRAN", "false").lower() == "true"

VERIFY_IRAN = "https://api.arcaptcha.ir/arcaptcha/api/verify"
VERIFY_FOREIGN = "https://api.arcaptcha.net/arcaptcha/api/verify"
VERIFY_FOREIGN_FROM_IRAN = "https://eu-api.arcaptcha.net/arcaptcha/api/verify"


def get_verify_url(challenge_id: str) -> str:
    if not challenge_id.startswith("eu-"):
        return VERIFY_IRAN
    if SERVER_IN_IRAN:
        return VERIFY_FOREIGN_FROM_IRAN
    return VERIFY_FOREIGN


# challenge_id is the value of the frontend `arcaptcha-token` field.
def verify(challenge_id: str, site_key: str) -> bool:
    url = get_verify_url(challenge_id)
    response = requests.post(
        url,
        json={
            "secret_key": SECRET_KEY,
            "site_key": site_key,
            "challenge_id": challenge_id,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("success") is True
```

---

## Your checklist

- [ ] Widget loaded from `https://widget.arcaptcha.net/1/api.js`
- [ ] Frontend sends `arcaptcha-token` to your backend; backend passes it as `challenge_id` to verify
- [ ] Backend routes verify requests using the table above
- [ ] If backend is in Iran and `challenge_id` starts with `eu-`, confirm reachability to `https://eu-api.arcaptcha.net`
- [ ] Secret key kept in environment variables or a secret manager

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| Non-Iran end users fail | For `eu-*` challenges with server outside Iran, use `https://api.arcaptcha.net/arcaptcha/api/verify` |
| Iran-hosted server fails `eu-*` challenges | Use `https://eu-api.arcaptcha.net/arcaptcha/api/verify` and test connectivity from Iran |
| Iran end users fail | Non-`eu-` challenges must use `https://api.arcaptcha.ir/arcaptcha/api/verify` |
| Widget not loading | Script URL must be `https://widget.arcaptcha.net/1/api.js` |

