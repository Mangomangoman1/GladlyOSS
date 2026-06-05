import { describe, expect, it } from 'vitest'

import { auditRepository, DEMO_SNAPSHOT } from './audit'
import { getFindingImpact, getTemplateImpact } from './impact'

const demoAudit = auditRepository(DEMO_SNAPSHOT)

function findById(id: string) {
  const finding = demoAudit.findings.find((candidate) => candidate.id === id)

  if (!finding) {
    throw new Error(`Expected demo audit to include ${id}`)
  }

  return finding
}

describe('getFindingImpact', () => {
  it('projects the score lift for a missing required file', () => {
    const impact = getFindingImpact(demoAudit, findById('contributing'))

    expect(impact).toMatchObject({
      points: 15,
      projectedScore: 90,
      impactLabel: '+15 readiness impact',
      scoreLabel: 'Projected score 90/100',
      isComplete: false,
    })
    expect(impact.detail).toContain('move tiny-library from 75/100 to 90/100')
  })

  it('projects recommended improvements with the same weighted model', () => {
    const impact = getFindingImpact(demoAudit, findById('security'))

    expect(impact.points).toBe(10)
    expect(impact.projectedScore).toBe(85)
    expect(impact.impactLabel).toBe('+10 readiness impact')
  })

  it('keeps completed findings at the current score with matched evidence', () => {
    const impact = getFindingImpact(demoAudit, findById('readme'))

    expect(impact).toMatchObject({
      points: 0,
      projectedScore: 75,
      impactLabel: 'Already counted',
      scoreLabel: 'Current score 75/100',
      isComplete: true,
    })
    expect(impact.detail).toContain('Gladly found README.md')
  })
})

describe('getTemplateImpact', () => {
  it('returns the impact for the finding behind a generated template', () => {
    expect(getTemplateImpact(demoAudit, 'security')?.scoreLabel).toBe(
      'Projected score 85/100',
    )
  })
})
