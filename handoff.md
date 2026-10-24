# Handoff: ARCaptcha Agent Integration Feature ("Add to your Agent" & AI-Readable Docs)

## 1. Goal & Context
The goal is to implement an **Agent Integration & AI-Friendly Documentation** feature for ARCaptcha docs (built on Docusaurus v3 at `/home/arcaptcha/Desktop/Github/Arcaptcha-docs`), inspired by [Freestyle Docs](https://www.freestyle.sh/docs).

This feature makes the documentation easily consumable by AI coding agents and provides developers with 1-click tools to integrate ARCaptcha into their projects using their AI assistants.

---

## 2. Settled Decisions (Grilling Rounds Completed)

1. **Architecture & Scope (Dual Layer)**:
   - **Infrastructure / Machine-Readable Layer**: Static files `llms.txt`, `llms-full.txt`, and `onboard.md` (which functions as the standard agent skill specification for ARCaptcha).
   - **UI Component Layer**:
     - A global persistent "Add to your Agent" widget in the right sidebar / Table of Contents (TOC) rail on all doc pages.
     - A dedicated "Integrate with your Agents" section in the Quick Start guide (`versioned_docs/version-4.0.0/quick start.md`) with copyable prompts and SDK guidance.

2. **Target AI Agents (Icons & Integrations)**:
   - **Claude Code**: `claude-cli://open?q=...`
   - **Cursor**: `https://cursor.com/link/rule?name=arcaptcha-docs&text=...`
   - **Codex**: `codex://threads/new?prompt=...`
   - **OpenCode**: CLI instruction / direct prompt copy
   - *(GitHub Copilot excluded as decided by user)*.

3. **Content & Language Specifications**:
   - Content inside `onboard.md`, `llms.txt`, and agent prompts must be in **English** (for maximum AI accuracy and adherence).
   - Must cover **full-stack implementation**:
     1. Client-side widget script (`https://nwidget.arcaptcha.ir/1/api.js`) and `<div class="arcaptcha" data-site-key="..."></div>`.
     2. Server-side token verification (`POST https://api.arcaptcha.ir/arcaptcha/api/verify` with `secret_key` and `challenge_id`).
     3. Official SDK references (Node.js, Python, PHP, Go, React, Vue, WordPress).
     4. Clear fallback instructions explaining REST verification if an SDK is not available for a specific framework/language.
   - Distinct differentiation between public Site Key and server-only Secret Key.

4. **Maintenance & Generation Mechanism**:
   - **No automated JS build script** (as requested by user to keep accuracy high and avoid unwanted build complexity).
   - Files are maintained directly as static files (`static/llms.txt`, `static/onboard.md`).
   - A binding rule must be added to `AGENTS.md` requiring that whenever docs or SDK details change, `llms.txt` and `onboard.md` must be updated accordingly.

5. **Widget Interaction & Copy Behavior**:
   - **Deep-links with Fallback**: Deep links attempt to trigger the desktop agent protocol, while simultaneously copying the onboarding prompt to the clipboard and showing a visual confirmation (toast/tooltip).
   - **Copy Markdown / Text Content**: A button in the TOC widget that copies clean Markdown of the active page to clipboard, allowing instant pasting into any chat interface.

---

## 3. Next Steps & Implementation Plan

When resuming work, follow these steps:

### Step 1: Create Static Agent Assets
1. **`static/onboard.md`**:
   - Follow standard `SKILL.md` format with frontmatter (`name: arcaptcha-docs`, description, URL).
   - Full instructions for agents: site key setup, frontend widget, backend verification, official SDKs list, fallback curl/REST spec.
2. **`static/llms.txt` & `static/llms-full.txt`**:
   - Index of all documentation pages in Arcaptcha-docs (`quick start`, `installation`, `API`, `configuration`, `plugins`, `invisible captcha`, `agent`).

### Step 2: Update `AGENTS.md`
- Add the rule agreed upon in Round 4:
  ```markdown
  ### Documentation & LLMs Sync
  Whenever modifying documentation or SDKs, always keep `static/llms.txt` and `static/onboard.md` updated.
  ```

### Step 3: Swizzle & Build UI Components
1. **TOC Rail Widget (`Add to your Agent`)**:
   - Swizzle or wrap Docusaurus TOC (`src/theme/TOC` or `DocItem/TOC/Desktop`).
   - Add `AgentBox` component below TOC:
     - Title: "Add to your Agent"
     - Agent buttons: Claude Code, Cursor, Codex, OpenCode.
     - Action buttons: "Copy Text Content" (copies page markdown) and "Open Markdown" (`/docs/...`).
   - Style with clean CSS matching Docusaurus dark/light themes.
2. **Quick Start Section (`Integrate with your Agents`)**:
   - Add an "Integrate with AI Agents" card/section in `versioned_docs/version-4.0.0/quick start.md` (and i18n if applicable).
   - Include a 1-click "Copy Prompt" button and links to `onboard.md` / `llms.txt`.

### Step 4: Verification
- Run `npm run build` or `npm run start` to ensure clean build and no broken links.

---

## 4. Suggested Skills for Next Agent
- `modern-web-guidance`: For best modern frontend & clipboard interaction practices in React/Docusaurus.
- `writing-for-agents`: For verifying the exact formatting and prompt structure in `onboard.md` and `AGENTS.md`.
