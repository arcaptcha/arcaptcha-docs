# Agent Skills & AI Integration

Using **Claude Code**, **Cursor**, **ChatGPT**, **OpenCode**, or another AI coding assistant? You can integrate ARCaptcha bot protection into your application automatically without writing repetitive boilerplate code.

ARCaptcha provides standardized, machine-readable specifications that enable autonomous agents to configure client-side widget embedding, server-side challenge verification, and official SDKs with zero guesswork.

---

## 1-Click Agent Prompt

To turn your AI coding assistant into an ARCaptcha integration expert, copy and paste this prompt into your agent session:

```text
Please read https://docs.arcaptcha.co/onboard.md and help me integrate ARCaptcha into this project.
```

This single command directs your agent to our comprehensive, machine-readable [onboard.md](https://docs.arcaptcha.co/onboard.md) specification, containing all frontend requirements, backend verification endpoints, official SDK references, and security rules.

---

## Supported AI Assistants

---

## Security Architecture & Best Practices

ARCaptcha employs a strict two-key security model. When prompting your agent, enforce key separation:

| Key | Environment | Placement | Security Rule |
| :--- | :--- | :--- | :--- |
| **Site Key** (`site_key`) | Public (Client-Side) | HTML container attribute `data-site-key`, SDK config | Safe to share with your agent and commit to frontend markup or client configs. |
| **Secret Key** (`secret_key`) | Private (Server-Side) | Server environment variables (e.g. `ARCAPTCHA_SECRET_KEY`) | **CRITICAL**: Never expose the Secret Key in client-side code, git commits, or frontend bundles. Instruct your agent to read it only from backend environment variables. |

> **Caution: Protect Your Secret Key**
>
> Never allow an AI assistant to paste your `secret_key` into client-side JavaScript or HTML templates. The Secret Key must only be accessed by trusted backend servers calling `https://api.arcaptcha.co/arcaptcha/api/verify`.

---

## Step-by-Step Workflow

1. **Get Credentials**: Retrieve your **Site Key** and **Secret Key** from the [ARCaptcha Dashboard](https://dashboard.arcaptcha.co/log-in).
2. **Configure Environment**: Add your `secret_key` to your backend `.env` file (e.g. `ARCAPTCHA_SECRET_KEY=your_secret_key`).
3. **Prompt Your Agent**: Specify the exact form or endpoint you wish to protect:
   ```text
   Please read https://docs.arcaptcha.co/onboard.md and add ARCaptcha protection to my login form at /login and verify the token on the server.
   ```
4. **Agent Performs Integration**:
   - Injects the script: `https://nwidget.arcaptcha.ir/1/api.js` (or installs the official framework SDK).
   - Mounts the `<div class="arcaptcha" data-site-key="YOUR_SITE_KEY"></div>` container inside the target form.
   - Extracts the submitted `arcaptcha-token` in your backend route.
   - Verifies the token against `https://api.arcaptcha.co/arcaptcha/api/verify` before executing sensitive business logic.

---

## Machine-Readable Specifications for Agents

- **[Agent Onboard Specification (onboard.md)](https://docs.arcaptcha.co/onboard.md)**: Authoritative, self-contained implementation specification and security guidelines for AI coding agents.
- **[Documentation Index (llms.txt)](https://docs.arcaptcha.co/llms.txt)**: High-density index of all documentation pages, guides, and resources.
- **[Consolidated Documentation Context (llms-full.txt)](https://docs.arcaptcha.co/llms-full.txt)**: Complete technical documentation in a single unified text file.

---

> **Info: Manual Integration**
>
> Prefer to install ARCaptcha without an AI assistant? Follow the step-by-step [Installation](./installation.md) guide or explore pre-built [Plugins and Libraries](./plugins.md).
