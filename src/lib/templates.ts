import type { RepositorySnapshot, TemplateId } from './audit'

export interface TemplateDefinition {
  id: TemplateId
  title: string
  filename: string
  description: string
}

export const TEMPLATE_DEFINITIONS: Record<TemplateId, TemplateDefinition> = {
  readme: {
    id: 'readme',
    title: 'README',
    filename: 'README.md',
    description: 'Give new visitors a clear path from curiosity to first use.',
  },
  license: {
    id: 'license',
    title: 'MIT License',
    filename: 'LICENSE',
    description: 'Use a permissive starter license that is easy to understand.',
  },
  contributing: {
    id: 'contributing',
    title: 'Contributing guide',
    filename: 'CONTRIBUTING.md',
    description: 'Make the first contribution feel possible and predictable.',
  },
  'code-of-conduct': {
    id: 'code-of-conduct',
    title: 'Code of conduct',
    filename: 'CODE_OF_CONDUCT.md',
    description: 'Set a welcoming participation standard for the community.',
  },
  security: {
    id: 'security',
    title: 'Security policy',
    filename: 'SECURITY.md',
    description: 'Provide a private route for responsible disclosure.',
  },
  'issue-template': {
    id: 'issue-template',
    title: 'Bug report issue form',
    filename: '.github/ISSUE_TEMPLATE/bug_report.yml',
    description: 'Collect reproducible reports with less back-and-forth.',
  },
  'pull-request-template': {
    id: 'pull-request-template',
    title: 'Pull request template',
    filename: '.github/PULL_REQUEST_TEMPLATE.md',
    description: 'Help contributors explain intent and verify changes.',
  },
  changelog: {
    id: 'changelog',
    title: 'Changelog',
    filename: 'CHANGELOG.md',
    description: 'Keep a human-readable history of meaningful changes.',
  },
}

function repositoryUrl(snapshot: RepositorySnapshot) {
  return `https://github.com/${snapshot.owner}/${snapshot.name}`
}

const templateGenerators: Record<
  TemplateId,
  (snapshot: RepositorySnapshot) => string
> = {
  readme: (snapshot) => `# ${snapshot.name}

${snapshot.description ?? 'A short description of what this project makes possible.'}

## Getting started

Describe the quickest way to try the project locally.

## Usage

Add a small, practical example here.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
`,
  license: (snapshot) => `MIT License

Copyright (c) ${new Date().getFullYear()} ${snapshot.owner}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
  contributing: (snapshot) => `# Contributing to ${snapshot.name}

Thank you for your interest in contributing. We welcome thoughtful contributions from everyone.

## Getting started

1. Fork the repository.
2. Clone your fork: \`git clone ${repositoryUrl(snapshot)}.git\`
3. Create a branch: \`git switch -c feature/your-change\`
4. Make your changes and add tests when applicable.
5. Run the project's checks locally.
6. Commit your work: \`git commit -m "feat: describe your change"\`
7. Open a pull request.

## Before opening a pull request

- Keep the change focused.
- Explain why the change is useful.
- Include screenshots for visible interface changes.
- Update documentation when behavior changes.

## Questions

Open a GitHub discussion or issue if you are unsure where to begin.
`,
  'code-of-conduct': () => `# Code of Conduct

## Our pledge

We pledge to make participation in this project a welcoming experience for everyone.

## Our standards

Examples of positive behavior include empathy, constructive feedback, respect for differing viewpoints, and graceful acceptance of responsibility.

Examples of unacceptable behavior include harassment, personal attacks, publishing private information, and conduct that would reasonably be considered inappropriate in a professional setting.

## Enforcement

Project maintainers are responsible for clarifying and enforcing these standards. Instances of abusive or otherwise unacceptable behavior may be reported privately to the project maintainers.
`,
  security: (snapshot) => `# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting flow:
${repositoryUrl(snapshot)}/security/advisories/new

Include a clear description, reproduction steps, and the potential impact when possible. Maintainers will acknowledge your report as soon as they can and keep you informed while it is reviewed.
`,
  'issue-template': (snapshot) => `name: Bug report
description: Tell us about a reproducible problem in ${snapshot.name}
title: "[Bug]: "
labels: ["bug"]
body:
  - type: textarea
    attributes:
      label: What happened?
      description: Explain what you expected and what you saw instead.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Steps to reproduce
      description: List the smallest set of steps that shows the problem.
    validations:
      required: true
  - type: input
    attributes:
      label: Environment
      description: Include the relevant browser, operating system, or runtime version.
`,
  'pull-request-template': () => `## What changed?

Describe the change and why it is useful.

## How was it verified?

- [ ] I ran the relevant automated checks.
- [ ] I tested the user-facing flow when applicable.
- [ ] I updated documentation when behavior changed.

## Screenshots

Include screenshots for visible interface changes.
`,
  changelog: (snapshot) => `# Changelog

All notable changes to ${snapshot.name} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Initial project changelog.
`,
}

export function getTemplateDefinition(templateId: TemplateId) {
  return TEMPLATE_DEFINITIONS[templateId]
}

export function generateTemplate(
  templateId: TemplateId,
  snapshot: RepositorySnapshot,
) {
  return templateGenerators[templateId](snapshot)
}
