# Bypass Mode and Disaster Recovery

ARCaptcha's bypass flow uses the ARCaptcha heartbeat endpoint to decide whether the browser should load the CAPTCHA widget. If the heartbeat is unavailable, the widget is not loaded. Your backend then applies an explicit outage policy; bypassing CAPTCHA is an application security decision, not a CAPTCHA pass.

![The server polls and caches heartbeat, decides whether the widget may load, and returns that decision to the browser. The browser follows the decision; the server later verifies the token or applies its outage policy.](/img/arcaptcha-bypass-flow.svg)

## 1. Check the ARCaptcha heartbeat

Send a `GET` request to:

`https://api.arcaptcha.ir/arcaptcha/api/heartbeat`

A healthy response is HTTP success with JSON `{"OK":true}`. Treat a non-success HTTP status, timeout, network/CORS error, invalid JSON, or any response other than `OK: true` as a failed heartbeat.

### Browser behavior

The server periodically calls the heartbeat endpoint and caches its latest result. The server—not the browser—uses that cache to decide whether the widget may load. There are two ways to deliver its decision:

- **Server-rendered app:** the server includes the widget script only when its cached heartbeat is healthy; otherwise it omits the script.
- **Client-rendered app:** the client asks its backend for a `loadWidget` decision and follows it. The sample exposes this decision at `GET /api/captcha/bootstrap`; the client must not call the provider or interpret raw heartbeat data itself.

When the server decides not to load the widget, omit it in SSR or return `loadWidget: false` in CSR. Do not create a local challenge or CAPTCHA token.

The [Node.js demo project](https://github.com/arcaptcha/arcaptcha-bypass-mode-demo) demonstrates the SSR pattern and simulates both heartbeat outcomes. `src/server.js` renders the widget only when heartbeat is healthy; `src/widget-view.js` builds the corresponding markup, and `src/heartbeat.js` polls the endpoint. The `/api/captcha/bootstrap` route provides the server decision for CSR applications. The demo starts with a simulated heartbeat failure and fail-open policy so the complete bypass path is visible.

## 2. Choose how the server checks availability

The demo uses periodic monitoring: the server polls the heartbeat at a configurable interval and caches the latest status in memory. Both the browser gate and backend fallback decision read the same cached value.

For multiple production instances, store status in shared storage such as Redis so every server makes the same decision. Set a freshness limit and treat stale status as unknown rather than healthy. A request-time check is an alternative when freshness is more important than reducing heartbeat traffic.

Run the demo with `npm start`; it simulates heartbeat failure by default. Its local fail-open default is for demonstration only—production applications should choose their own policy, with fail-closed as the safer starting point.

The server decides whether the widget should load. The browser only follows the `loadWidget` response and never reads or submits raw heartbeat state as authorization. The backend uses its own cached heartbeat when deciding whether to verify or apply the outage policy.

## 3. Verify tokens and apply an outage policy

When a token is available, verify it server-side using `POST https://api.arcaptcha.co/arcaptcha/api/verify` with `site_key`, `secret_key`, and `challenge_id` (the submitted `arcaptcha-token`).

- A response with `success: true` is a verified CAPTCHA.
- A response with `success: false` is an invalid token and must be rejected, even if fail-open is configured.
- Network failures, timeouts, and temporary service errors can use the outage policy configured by your application.

| Policy | If ARCaptcha is unavailable | Trade-off |
| --- | --- | --- |
| **Fail-closed** (recommended default) | Reject or defer the protected action. | Preserves CAPTCHA enforcement, but can block users during an outage. |
| **Fail-open** (explicit opt-in) | Allow the action without a verified token. | Preserves availability, but increases exposure to automated abuse. |

Do not turn a definitive invalid-token response, missing server credentials, or integration error into a bypass pass. Never trust a client-supplied “heartbeat failed” or “captcha passed” flag on its own. Log bypass decisions without logging tokens or secret keys; consider limiting fail-open to low-risk actions, rate-limiting, and alerting on bypass volume and duration.

## 4. Test recovery before production

Test these cases in a staging environment:

1. **Heartbeat healthy:** confirm the browser loads the widget, a valid token verifies, and an invalid token is rejected.
2. **Heartbeat unavailable:** confirm the browser does not request the widget script and creates no token.
3. **Backend heartbeat unavailable:** submit without a token and confirm the backend applies the configured fail-closed or fail-open policy using its own status.
4. **Verification API unavailable after a challenge:** confirm a network/temporary service failure follows policy, while `success: false` still rejects.
5. **Recovery:** restore the heartbeat and verify that new page loads return to normal CAPTCHA loading and verification without a manual reset.

The runnable [Node.js sample project](https://github.com/arcaptcha/arcaptcha-bypass-mode-demo) contains the client gate, periodic heartbeat handling, server-side verification, policy behavior, and heartbeat-failure simulation.
