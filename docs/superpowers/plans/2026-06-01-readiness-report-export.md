# Readiness Report Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shareable Markdown readiness report drawer that turns a Gladly audit into a reusable maintainer artifact.

**Architecture:** Generate deterministic Markdown in a framework-independent `src/lib/report.ts` module so future CLI and GitHub Action surfaces can reuse it. Render and export that report through a focused `ReportDrawer` component controlled by `App`.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Lucide React, plain CSS

---

### Task 1: Markdown Report Generator

**Files:**
- Create: `src/lib/report.ts`
- Create: `src/lib/report.test.ts`

- [ ] **Step 1: Write failing report tests**

Add tests that import `generateReadinessReport` and `getReportFilename`. Assert that demo audit output includes `75/100`, incomplete checklist items, numbered next steps, and the share URL. Assert that a complete audit reports `100/100` and `No immediate readiness gaps found.` Assert that filename generation returns `tiny-library-gladly-report.md`.

- [ ] **Step 2: Run the focused tests and verify the missing-module failure**

Run: `npm test -- --run src/lib/report.test.ts`

Expected: FAIL because `src/lib/report.ts` does not exist.

- [ ] **Step 3: Implement deterministic report generation**

Create `src/lib/report.ts` with:

```ts
export function generateReadinessReport(
  audit: RepositoryAudit,
  shareUrl: string,
): string

export function getReportFilename(audit: RepositoryAudit): string
```

Use `audit.findings` order for both checklist and best-next-step sections.

- [ ] **Step 4: Run the focused tests**

Run: `npm test -- --run src/lib/report.test.ts`

Expected: PASS.

### Task 2: Report Drawer Interface

**Files:**
- Create: `src/components/ReportDrawer.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing interface tests**

Add tests that click `Export report`, assert that the `Readiness report` dialog shows `75/100`, assert that `Close report` removes it, and assert that `Copy Markdown` calls a mocked clipboard writer and shows `Markdown copied`.

- [ ] **Step 2: Run the focused tests and verify the missing-interface failure**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because the `Export report` action is absent.

- [ ] **Step 3: Implement the report drawer**

Create `ReportDrawer` with score, category breakdown, incomplete next steps, a Markdown preview, `Copy Markdown`, `Download .md`, `Copy share link`, and `Close report` actions. Add `isReportOpen` state and the share URL in `App`. Add responsive drawer CSS without custom focus styling.

- [ ] **Step 4: Run the focused interface tests**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS.

### Task 3: Public Documentation

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Document report export**

Add report export to the README feature list and architecture map. Add it to the changelog under `Added`. Remove exportable Markdown reports from the roadmap because the capability now exists.

### Task 4: Verification and Commit

**Files:**
- Verify: all changed files

- [ ] **Step 1: Run complete verification**

Run:

```bash
npm test -- --run
npm run check
npm run build
git diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 2: Review focus styling**

Run:

```bash
rg -n "focus|focus-visible|outline|ring-|box-shadow" src
```

Expected: no new custom focus styles.

- [ ] **Step 3: Commit**

Run:

```bash
git add docs/superpowers/specs/2026-06-01-readiness-report-export-design.md \
  docs/superpowers/plans/2026-06-01-readiness-report-export.md \
  src/lib/report.ts src/lib/report.test.ts src/components/ReportDrawer.tsx \
  src/App.tsx src/App.test.tsx src/styles.css README.md CHANGELOG.md
git commit -m "feat: export repository readiness reports"
```
