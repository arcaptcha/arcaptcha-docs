# Spec: Agent Integration & AI-Friendly Documentation

## Problem Statement

Developers wanting to protect their applications with ARCaptcha increasingly use AI coding assistants and CLI agents (such as Claude Code, Cursor, Codex, and OpenCode) to scaffold and implement features. 

Currently, ARCaptcha documentation is designed primarily for human visual browsing. AI agents struggle to efficiently ingest, navigate, and synthesize the full-stack setup requirements (frontend script injection, container placement, token extraction, server-side secret validation, and fallback REST APIs) from fragmented HTML pages. Furthermore, developers working in modern AI IDEs have no 1-click mechanism from within the documentation to load ARCaptcha context and integration instructions directly into their agent sessions, resulting in context-switching, copy-pasting friction, and improper implementations (such as accidentally exposing the server secret key in frontend code).

## Solution

Provide a dual-layer AI agent integration for ARCaptcha docs:

1. **Machine-Readable Layer**: Provide standardized, high-density static agent specifications (`onboard.md`, `llms.txt`, and `llms-full.txt`) that AI agents can consume in a single round-trip without HTML noise or fragmented navigation.
2. **Interactive UI Component Layer**: Embed a sleek, persistent "Add to your Agent" widget directly in the desktop Table of Contents (TOC) sidebar across all documentation pages, offering 1-click deep links and prompt copying for Claude Code, Cursor, Codex, and OpenCode, alongside "Copy Text Content" and "Open Markdown" actions.
3. **Synchronized Documentation**: Provide dedicated onboarding sections in the Quick Start guide and update the existing agent documentation page in both English and Persian to guide developers on agent-assisted integration.

## User Stories

1. As a full-stack developer using Claude Code in my terminal, I want to click a Claude Code button in the documentation sidebar, so that my CLI agent automatically opens with a prompt pointing to ARCaptcha's onboarding instructions.
2. As a software engineer using Cursor IDE, I want to click a Cursor button in the sidebar, so that ARCaptcha integration rules and documentation context are immediately imported into my Cursor project.
3. As a developer using Codex, I want to click a Codex button in the sidebar, so that a new session starts with a direct instruction to integrate ARCaptcha into my active repository.
4. As an OpenCode user, I want to click an OpenCode button in the sidebar, so that the exact CLI command and integration prompt are copied to my clipboard with instant visual confirmation.
5. As a developer whose system protocol handler cannot open desktop deep-links, I want the onboarding prompt automatically copied to my clipboard when clicking any agent button, so that I can manually paste it into any assistant chat without friction.
6. As a developer working with any LLM chat interface (ChatGPT, Claude, Gemini), I want a "Copy Text Content" button in the sidebar, so that I can copy the current page's clean Markdown source directly into my LLM prompt.
7. As an engineer reviewing source documentation, I want an "Open Markdown" button in the sidebar, so that I can inspect the raw source file of the current page in a new browser tab.
8. As a mobile visitor reading documentation on a phone, I want the reading experience to remain clean and uncluttered, so that agent-specific desktop widgets do not block my navigation or content drawer.
9. As an autonomous AI agent scanning the website, I want to read `/llms.txt`, so that I have a curated index of all available documentation pages and topics.
10. As an autonomous AI agent needing comprehensive context, I want to read `/llms-full.txt`, so that I can ingest the complete technical reference in a single request.
11. As an AI coding agent tasked with integrating ARCaptcha, I want to read `/onboard.md`, so that I get explicit instructions on client widget placement, server-side verification, official SDKs, and REST fallbacks.
12. As a security-conscious engineer, I want the agent prompt and onboarding guide to strictly differentiate between the public Site Key and the private Secret Key, so that AI assistants never commit secrets to client-side code.
13. As a developer browsing the Quick Start guide, I want a dedicated "Integrate with your Agents" section, so that I can easily find 1-click prompts and SDK recommendations right after the manual quick start steps.
14. As a Persian-speaking developer browsing the Persian documentation (`/fa/...`), I want the Quick Start and Agent documentation pages translated and fully synchronized, so that I have an equally clear experience in my preferred language.
15. As a maintainer editing documentation or adding new SDKs, I want explicit repository rules in `AGENTS.md`, so that any agent or contributor updating the docs knows to keep `llms.txt` and `onboard.md` in sync.

## Implementation Decisions

- **Machine-Readable Layer (Static Specifications)**:
  - Deliver three static assets served from the web root: an onboarding agent skill specification (`onboard.md`), a documentation index (`llms.txt`), and a consolidated full documentation file (`llms-full.txt`).
  - All machine-readable files must be written in English for maximum AI reasoning accuracy and cross-agent instruction following.
  - The onboarding specification must cover the complete end-to-end integration lifecycle: client-side script inclusion, widget container placement, frontend challenge token generation, server-side verification endpoint contract, official SDK listings, and REST API fallbacks for unsupported stacks.
  - Clear architectural security guidance must enforce placing the Site Key on client widgets and isolating the Secret Key in secure server environment variables.

- **Desktop Sidebar Component Integration**:
  - Extend the desktop Table of Contents rail using the documentation framework's official component wrapping pattern rather than a full theme replacement, ensuring future theme upgrades remain seamless.
  - The widget renders underneath the Table of Contents exclusively on desktop viewports. It is hidden on small/mobile screens to keep mobile reading uncluttered.
  - The widget features four target agent integrations: Claude Code, Cursor, Codex, and OpenCode.
  - Deep-link URLs use lightweight pointers referencing the hosted onboarding specification rather than inlining large prompt text, avoiding operating system protocol URL length limits (2000 character boundaries).
  - Every agent action triggers an asynchronous clipboard copy of the prompt and displays an accessible visual confirmation (tooltip / toast).
  - The "Copy Text Content" action retrieves the clean source Markdown corresponding to the active page from the repository, with a graceful DOM-text fallback in case of transient network issues.
  - The "Open Markdown" action opens the raw source file in the repository in a new browser tab.
  - Visual styling utilizes the project's CSS design system with full native dark-mode and light-mode theme support, modern typography, micro-interactions, and high contrast.

- **Content & Documentation Synchronization**:
  - The Quick Start guide incorporates a prominent "Integrate with AI Agents" section featuring one-click copyable prompts and direct links to the onboarding specification.
  - The existing dedicated Agent documentation page is completely updated in both English and Persian to align with the new onboarding architecture, replacing outdated archive download references with modern one-click prompt workflows.

- **Repository Maintenance & Governance**:
  - Add a permanent governance rule to `AGENTS.md` obligating human and AI contributors to update `onboard.md` and `llms.txt` whenever documentation or SDK interfaces are modified.

## Testing Decisions

- **What Makes a Good Test**:
  - Tests must verify external behavior and system contracts rather than internal implementation details.
  - Verification ensures that all static assets are served at expected routes, documentation builds succeed with zero broken links, theme wrapping compiles without syntax or lifecycle errors, and deep-link / copy interactions trigger the appropriate contracts.

- **Testing Seams**:
  - **Seam 1: Full Documentation Site Build**: Run the production build command (`npm run build`). This verifies that MDX parsing, component wrapping, TypeScript/JavaScript imports, asset resolution, and link checking (`onBrokenLinks: "throw"`) pass cleanly without errors.
  - **Seam 2: Static Asset Contract Verification**: Verify that `/onboard.md`, `/llms.txt`, and `/llms-full.txt` exist in the static distribution output, conform to Markdown/text syntax, and contain expected sections (Site Key, Secret Key, verification endpoint, SDK references).
  - **Seam 3: UI Component Rendering & Behavior**: Verify that the sidebar widget renders on documentation pages with the expected agent buttons, correct deep-link schemes (`claude-cli://`, `https://cursor.com/`, `codex://`), and clipboard copy triggers.

- **Prior Art**:
  - Existing Docusaurus build script and configuration in `package.json` (`npm run build`).

## Out of Scope

- Automated dynamic JavaScript build scripts or GitHub Actions that auto-generate `llms.txt` at build time (manual static maintenance was explicitly selected to guarantee precision and avoid build toolchain overhead).
- Mobile drawer / mobile TOC integration for the agent widget (agent workflows are targeted specifically to desktop development environments).
- GitHub Copilot specific deep-link buttons (excluded per settled requirements).

## Further Notes

- The onboarding prompt format passed across deep-links and clipboard:
  `Please read https://docs.arcaptcha.co/onboard.md and help me integrate ARCaptcha into this project.`
- All CSS styles must be scoped and integrated into the site's custom CSS stylesheets to avoid leaking styles into standard documentation prose.
