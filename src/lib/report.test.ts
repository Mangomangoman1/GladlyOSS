import { describe, expect, it } from 'vitest'

import { auditRepository, DEMO_SNAPSHOT } from './audit'
import { generateReadinessReport, getReportFilename } from './report'

const shareUrl =
  'https://mangomangoman1.github.io/GladlyOSS/?repo=open-garden%2Ftiny-library'

describe('generateReadinessReport', () => {
  it('summarizes incomplete audits with prioritized next steps', () => {
    const report = generateReadinessReport(
      auditRepository(DEMO_SNAPSHOT),
      shareUrl,
    )

    expect(report).toContain('# tiny-library open-source readiness report')
    expect(report).toContain('**75/100** — A strong start')
    expect(report).toContain('- [ ] Contributing guide — Missing')
    expect(report).toContain('- [ ] Security policy — Recommended')
    expect(report).toContain(
      '1. **Contributing guide** — +15 readiness impact; projected score 90/100. Turn interest into a clear first contribution path.',
    )
    expect(report).toContain(`[Open this audit in Gladly](${shareUrl})`)
  })

  it('celebrates complete audits without rendering an empty next-step list', () => {
    const audit = auditRepository({
      ...DEMO_SNAPSHOT,
      files: [
        ...DEMO_SNAPSHOT.files,
        'CONTRIBUTING.md',
        'SECURITY.md',
      ],
    })

    const report = generateReadinessReport(audit, shareUrl)

    expect(report).toContain('**100/100** — Ready to welcome contributors')
    expect(report).toContain('No immediate readiness gaps found.')
  })
})

describe('getReportFilename', () => {
  it('creates a repository-specific Markdown filename', () => {
    expect(getReportFilename(auditRepository(DEMO_SNAPSHOT))).toBe(
      'tiny-library-gladly-report.md',
    )
  })
})
