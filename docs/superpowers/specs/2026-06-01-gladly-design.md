# Gladly Initial Release Design

## Product

Gladly is a local-first repository readiness workbench for open-source maintainers. A maintainer pastes a public GitHub repository URL, and Gladly inspects the repository's community-health files, scores its readiness, explains the most important gaps, and generates editable starter templates.

The initial release must be genuinely useful without an account, a backend, or a GitHub token. It should also model the standards it recommends by shipping its own community files and project documentation.

## First-Release Scope

The shipped product includes:

- A polished React web application that can audit a public GitHub repository.
- An offline demo audit for immediate exploration.
- A reusable TypeScript audit engine with weighted rules and human-readable findings.
- A GitHub API adapter that inspects repository metadata, root files, `.github` files, and issue-template directories without authentication.
- A prioritized checklist grouped by complete, recommended, and missing items.
- A score breakdown by essentials, collaboration, and stewardship.
- A template workbench with editable generated content, copy, download, and reset actions.
- Shareable repository audit URLs using the `?repo=owner/name` query parameter.
- Responsive desktop and mobile layouts.
- Automated tests for parsing, scoring, template generation, and GitHub response mapping.
- Public-repository documentation, contribution guidance, a code of conduct, a security policy, issue forms, a pull request template, and an MIT license.

## Audit Rules

Gladly inspects these readiness signals:

| Rule | Weight | Category | Accepted paths |
| --- | ---: | --- | --- |
| README | 20 | essentials | `README.md`, `README`, `README.rst` |
| License | 15 | essentials | `LICENSE`, `LICENSE.md`, `LICENSE.txt`, `COPYING` |
| Description | 5 | essentials | GitHub repository metadata |
| Contributing guide | 15 | collaboration | `CONTRIBUTING.md`, `.github/CONTRIBUTING.md` |
| Code of conduct | 10 | collaboration | `CODE_OF_CONDUCT.md`, `.github/CODE_OF_CONDUCT.md` |
| Issue templates | 10 | collaboration | `.github/ISSUE_TEMPLATE/*` |
| Pull request template | 10 | collaboration | `.github/PULL_REQUEST_TEMPLATE.md`, `PULL_REQUEST_TEMPLATE.md` |
| Security policy | 10 | stewardship | `SECURITY.md`, `.github/SECURITY.md` |
| Changelog | 5 | stewardship | `CHANGELOG.md`, `HISTORY.md`, `RELEASES.md` |

The score is the sum of completed weights. Findings are ordered by incomplete status first, then by descending weight. Scores of 85 or more are "Ready to welcome contributors", scores of 60 to 84 are "A strong start", and lower scores are "A few foundations first".

## Architecture

The project is a Vite-powered React and TypeScript application. The audit engine is kept framework-independent in `src/lib/audit.ts`, GitHub response fetching and mapping live in `src/lib/github.ts`, and contextual template generation lives in `src/lib/templates.ts`. This keeps the scoring rules testable and makes a future CLI, browser extension, or GitHub Action straightforward.

The UI is divided into focused components:

- `App` owns the selected repository, audit state, URL synchronization, and the currently selected finding.
- `Sidebar` provides product navigation and open-source project links.
- `AuditOverview` presents the score, repository summary, breakdown, and prioritized checklist.
- `TemplateWorkbench` generates and edits the selected community-health file.
- `RepoForm` accepts GitHub repository URLs and provides the offline demo path.

## Data Flow

1. The user enters a GitHub URL or `owner/repository` slug.
2. `parseRepoInput` validates and normalizes the entry.
3. `fetchRepositorySnapshot` requests independent GitHub API resources in parallel and maps them to a lightweight snapshot.
4. `auditRepository` evaluates snapshot paths and metadata against weighted rules.
5. React renders the score, breakdown, checklist, and generated template.
6. Selecting a finding changes the template shown in the workbench.
7. Copy and download actions operate entirely in the browser.

When network requests fail, the app presents a clear inline error and keeps the demo option available.

## Visual Direction

The interface follows the approved concept in `docs/design/gladly-dashboard-concept.png`.

- Warm white background with charcoal text and deep forest-green actions.
- Characterful serif typography for the Gladly wordmark, score, and major headings.
- Humanist sans-serif typography for interface text and body copy.
- An open layout with one strong score ring, a readable checklist, and a practical workbench.
- Restrained sage surfaces, thin borders, and minimal shadow.
- No generic dashboard card grid, decorative gradient glow, excessive pills, or custom focus rings.
- Desktop uses a slim left rail and three-column workbench. Mobile collapses into a top brand row and stacked sections.

## Error Handling

- Invalid repository inputs are rejected before any network request.
- Missing repositories and GitHub rate limits receive specific, plain-language messages.
- Optional GitHub resources may return `404`; those responses are treated as absent files, not app failures.
- Copy and download actions provide local UI feedback.

## Testing

The automated suite covers:

- Repository input normalization and rejection.
- Weighted score calculation and ordering.
- Category breakdowns.
- GitHub API mapping for existing and missing optional resources.
- Contextual template interpolation.

Browser QA covers:

- Demo load.
- Public repository audit flow.
- Checklist selection.
- Template editing and reset.
- Copy and download controls.
- URL sharing state.
- Desktop and mobile rendering.

## Future Growth

The architecture deliberately leaves room for:

- A CLI package for local folders.
- A GitHub Action and pull request comment bot.
- Authenticated audits with higher API limits.
- Organization dashboards.
- Custom rule packs.
- Exportable readiness reports.
- Guided pull requests that add generated files.
- Accessibility and documentation quality checks.

