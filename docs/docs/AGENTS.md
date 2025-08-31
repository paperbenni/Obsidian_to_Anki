# Repository Guidelines

This repo contains the Obsidian → Anki plugin source, docs, and tests. Use this guide for contributing.
All CLI examples below use `bun` (run scripts with `bun run <script>`).

## Project Structure & Module Organization
- Root: plugin source and build files (`main.ts`, `rollup.config.js`, `manifest.json`).
- `src/`: TypeScript source for the plugin.
- `tests/`: WebdriverIO and Python tests (`tests/anki/`, `tests/defaults/`).
- `docs/`: Vitepress documentation (this file lives here).
- `Images/`, `root/`: static assets and packaging helpers.

## Build, Test, and Development Commands
- `bun run dev`: Watch + build plugin during development (rollup watch).
- `bun run build`: Produce production bundle (`main.js`).
- `bun run docs:dev`: Run local docs site (Vitepress).
- `bun run docs:build`: Build static docs.
- `bun run test`: Runs integration (WebDriver) and Python tests (may require Docker and Python).
- `bun run copy`: Copy build artifacts into `tests/defaults/test_vault` for manual testing.

## Coding Style & Naming Conventions
- Language: TypeScript (ESModules). 2-space indentation preferred.
- Files: `kebab-case` for docs and assets, `PascalCase` for exported classes, `camelCase` for functions/variables.
 - Formatting: follow existing style; run TypeScript compiler (`tsc`) for type checks.
 - Package manager/runtime: use `bun` for installing and running scripts (e.g., `bun install`, `bun run <script>`).

## Testing Guidelines
- Integration tests: WebdriverIO (`wdio.conf.ts`).
- Unit/functional checks: Python tests under `tests/anki/` (run with `pytest`).
- Test files: name with `*.spec.ts` or `test_*.py`; keep fixtures under `tests/defaults/`.

## Commit & Pull Request Guidelines
- Commit messages: concise imperative style (e.g., `fix: export deck name correctly`).
- PR checklist: description, linked issue, testing notes, and screenshots for UI changes.
- Include `CHANGELOG` entry in PR for notable user-facing changes.

## Security & Configuration Tips
- Don’t commit secret keys; use `obsidian_to_anki_config.ini` locally and add to `.gitignore` if needed.
- Tests may require Docker (`test-wdio`)—ensure Docker daemon is running.

If you want, I can run linting, add a sample PR template, or create a CONTRIBUTING.md next.
