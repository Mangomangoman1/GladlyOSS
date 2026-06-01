import { describe, expect, it } from 'vitest'

import {
  auditRepository,
  parseRepoInput,
  type RepositorySnapshot,
} from './audit'

const completeSnapshot: RepositorySnapshot = {
  owner: 'with-heart',
  name: 'project',
  description: 'A welcoming open-source project.',
  defaultBranch: 'main',
  htmlUrl: 'https://github.com/with-heart/project',
  stars: 128,
  forks: 16,
  openIssues: 4,
  language: 'TypeScript',
  updatedAt: '2026-05-30T12:00:00Z',
  files: [
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    '.github/ISSUE_TEMPLATE/bug_report.yml',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'SECURITY.md',
    'CHANGELOG.md',
  ],
}

describe('parseRepoInput', () => {
  it('normalizes an owner and repository slug', () => {
    expect(parseRepoInput('  with-heart/project  ')).toEqual({
      owner: 'with-heart',
      name: 'project',
      slug: 'with-heart/project',
    })
  })

  it('normalizes a GitHub URL and removes a git suffix', () => {
    expect(parseRepoInput('https://github.com/with-heart/project.git/')).toEqual({
      owner: 'with-heart',
      name: 'project',
      slug: 'with-heart/project',
    })
  })

  it('rejects malformed repository inputs', () => {
    expect(() => parseRepoInput('project-only')).toThrow(
      'Enter a GitHub repository as owner/name or paste its GitHub URL.',
    )
  })
})

describe('auditRepository', () => {
  it('awards the full score when every readiness signal is present', () => {
    const audit = auditRepository(completeSnapshot)

    expect(audit.score).toBe(100)
    expect(audit.grade).toBe('Ready to welcome contributors')
    expect(audit.findings.every((finding) => finding.status === 'complete')).toBe(
      true,
    )
  })

  it('prioritizes missing essentials before recommended improvements', () => {
    const audit = auditRepository({
      ...completeSnapshot,
      description: null,
      files: ['CODE_OF_CONDUCT.md'],
    })

    expect(audit.score).toBe(10)
    expect(audit.findings.slice(0, 4).map((finding) => finding.id)).toEqual([
      'readme',
      'license',
      'contributing',
      'pull-request-template',
    ])
    expect(audit.findings.find((finding) => finding.id === 'security')?.status).toBe(
      'recommended',
    )
  })

  it('calculates category breakdowns from completed rule weights', () => {
    const audit = auditRepository({
      ...completeSnapshot,
      description: null,
      files: ['README.md', 'LICENSE', 'CONTRIBUTING.md'],
    })

    expect(audit.breakdown).toEqual({
      essentials: { earned: 35, total: 40, percentage: 88 },
      collaboration: { earned: 15, total: 45, percentage: 33 },
      stewardship: { earned: 0, total: 15, percentage: 0 },
    })
  })
})
