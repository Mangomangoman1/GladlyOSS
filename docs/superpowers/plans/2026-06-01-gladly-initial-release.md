# Gladly Initial Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a useful, polished first release of Gladly, a local-first repository readiness workbench for open-source maintainers.

**Architecture:** Keep auditing, GitHub mapping, and template generation in framework-independent TypeScript modules. Build a Vite React interface around those modules so the same engine can later power a CLI or GitHub Action.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Lucide React, plain CSS

---

### Task 1: Scaffold and Audit Engine

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/lib/audit.ts`
- Create: `src/lib/audit.test.ts`

- [ ] Write failing tests for repository input parsing, weighted scoring, ordered findings, and category breakdowns.
- [ ] Run `npm test -- --run src/lib/audit.test.ts` and confirm the suite fails because the audit module does not exist.
- [ ] Implement the framework-independent audit engine and seed demo snapshot.
- [ ] Run `npm test -- --run src/lib/audit.test.ts` and confirm the suite passes.

### Task 2: GitHub Adapter and Template Generator

**Files:**
- Create: `src/lib/github.ts`
- Create: `src/lib/github.test.ts`
- Create: `src/lib/templates.ts`
- Create: `src/lib/templates.test.ts`

- [ ] Write failing tests for GitHub API mapping, optional-resource handling, and contextual template interpolation.
- [ ] Run `npm test -- --run src/lib/github.test.ts src/lib/templates.test.ts` and confirm the tests fail because the modules do not exist.
- [ ] Implement parallel GitHub API fetching, plain-language errors, and generated starter templates.
- [ ] Run `npm test -- --run src/lib/github.test.ts src/lib/templates.test.ts` and confirm the suites pass.

### Task 3: React Product Surface

**Files:**
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/components/icons.tsx`
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/RepoForm.tsx`
- Create: `src/components/AuditOverview.tsx`
- Create: `src/components/TemplateWorkbench.tsx`
- Create: `src/styles.css`

- [ ] Build the accessible app shell and repository form.
- [ ] Wire the demo snapshot and live GitHub audit flow into the interface.
- [ ] Add the score ring, score breakdown, prioritized findings, template editor, copy, reset, and download actions.
- [ ] Match the approved concept and add the responsive stacked mobile layout.
- [ ] Run `npm run build` and resolve all type or bundling errors.

### Task 4: Public Repository Materials

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `SECURITY.md`
- Create: `CHANGELOG.md`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.gitignore`

- [ ] Write a clear README with the project purpose, features, screenshots, local setup, architecture, roadmap, and contribution path.
- [ ] Add standard open-source community-health files and issue forms.
- [ ] Confirm the repository models the audit standards it recommends.

### Task 5: Verification

**Files:**
- Verify: all project files

- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Start the development server and test the demo flow in the browser.
- [ ] Exercise a live public-repository audit, template selection, editing, reset, copy, and download.
- [ ] Capture desktop and mobile screenshots and compare the desktop result against `docs/design/gladly-dashboard-concept.png`.
- [ ] Run `git status --short` and review the final repository contents.

