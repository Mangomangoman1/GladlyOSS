# Readiness Report Export Design

## Purpose

Gladly already audits a public repository and generates individual starter files. The second release adds the missing bridge between diagnosis and collaboration: a shareable Markdown readiness report that maintainers can paste into an issue, download for later, or send as a link to the live audit.

## User Experience

Add an `Export report` action beside `Refresh audit` in the top bar. Selecting it opens a right-side report drawer over the application. The drawer contains:

- The repository name and current readiness score.
- A short explanation of what the score means.
- The three category breakdowns.
- A checklist of all nine findings with complete, missing, or recommended status.
- A prioritized `Best next steps` section containing only incomplete findings.
- The shareable Gladly audit URL.
- Actions to copy the Markdown report, download it as `<repository>-gladly-report.md`, copy the share link, and close the drawer.

The drawer uses the existing warm editorial visual language: a white paper-like panel, thin sage borders, a forest-green score accent, and restrained action buttons. It must be usable on mobile as a full-width sheet. It must not add custom focus rings or decorative outline treatments.

## Architecture

Create `src/lib/report.ts` as a framework-independent export module. It receives a `RepositoryAudit` and share URL, then returns deterministic Markdown. The module also provides a filename helper. This keeps report generation reusable by a future CLI or GitHub Action.

Create `src/components/ReportDrawer.tsx` for the report interface. `App` owns whether the drawer is open and computes the current share URL from the audited repository. The drawer receives the current audit and share URL as props.

## Markdown Format

The generated report includes:

1. `# <repository> open-source readiness report`
2. Gladly attribution and repository link.
3. `## Readiness score` with `<score>/100` and the current grade.
4. `## Category breakdown` table.
5. `## Checklist` with status markers:
   - `[x]` for complete.
   - `[ ]` for missing.
   - `[ ]` plus `(recommended)` for recommended.
6. `## Best next steps` with numbered incomplete findings ordered by the existing audit priority.
7. A shareable audit link.

When every finding is complete, `Best next steps` contains a brief positive message rather than an empty list.

## Error Handling

Clipboard actions attempt to write text and provide visible feedback. If the browser blocks clipboard access, the drawer explains that the report can be selected manually or downloaded. Download behavior stays entirely local.

## Testing

Automated coverage includes:

- Report Markdown for incomplete audits.
- Report Markdown for complete audits.
- Repository-specific report filenames.
- Drawer rendering from demo audit state.
- Drawer open and close behavior.
- Copy feedback after a successful mocked clipboard write.

Browser QA covers opening the report drawer from the deployed application, confirming the score and best-next-steps content, closing the drawer, and auditing the real Gladly repository to verify the complete-report state.
