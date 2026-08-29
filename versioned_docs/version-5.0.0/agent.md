---
sidebar_position: 2
---

# Agent Skills

Using Claude Code, Cursor, or another coding assistant? You can add the ARCaptcha widget without writing the integration yourself.

1. Download the [ARCaptcha skill](/downloads/arcaptcha-skills.zip) and add it to your project as a Cursor skill, or paste `SKILL.md` into the chat.
2. Give your agent your **site key**. Keep the **secret key** in an environment variable — never paste it into client-side code.
3. Ask the agent to protect a form, for example: `Add ARCaptcha to the signup form and verify the token on the server.`

The agent will load the widget script, insert the `.arcaptcha` container, and call the verify API. See [Installation](./installation.md) for the same steps if you prefer to add them yourself.
