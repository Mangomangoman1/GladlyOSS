import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

import { auditRepository } from '../src/lib/audit'

describe('Gladly repository health', () => {
  it('models every readiness signal that the product recommends', () => {
    const files = execSync('git ls-files', { encoding: 'utf8' })
      .trim()
      .split('\n')
    const audit = auditRepository({
      owner: 'Mangomangoman1',
      name: 'GladlyOSS',
      description: 'A local-first repository readiness workbench.',
      defaultBranch: 'main',
      htmlUrl: 'https://github.com/Mangomangoman1/GladlyOSS',
      stars: 0,
      forks: 0,
      openIssues: 0,
      language: 'TypeScript',
      updatedAt: new Date().toISOString(),
      files,
    })

    expect(audit.score).toBe(100)
    expect(
      audit.findings.filter((finding) => finding.status !== 'complete'),
    ).toEqual([])
  })
})
