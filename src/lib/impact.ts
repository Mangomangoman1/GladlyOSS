import type {
  AuditFinding,
  RepositoryAudit,
  TemplateId,
} from './audit'

export interface FindingImpact {
  points: number
  projectedScore: number
  impactLabel: string
  scoreLabel: string
  detail: string
  isComplete: boolean
}

export function getFindingImpact(
  audit: RepositoryAudit,
  finding: AuditFinding,
): FindingImpact {
  const isComplete = finding.status === 'complete'
  const points = isComplete ? 0 : finding.weight
  const projectedScore = Math.min(100, audit.score + points)

  if (isComplete) {
    const evidence = finding.matchedPath ?? finding.title

    return {
      points,
      projectedScore: audit.score,
      impactLabel: 'Already counted',
      scoreLabel: `Current score ${audit.score}/100`,
      detail: `Gladly found ${evidence}, so these ${finding.weight} points are already part of this audit.`,
      isComplete,
    }
  }

  return {
    points,
    projectedScore,
    impactLabel: `+${points} readiness impact`,
    scoreLabel: `Projected score ${projectedScore}/100`,
    detail: `Add ${finding.title.toLowerCase()} to move ${audit.repository.name} from ${audit.score}/100 to ${projectedScore}/100.`,
    isComplete,
  }
}

export function getTemplateImpact(
  audit: RepositoryAudit,
  templateId: TemplateId,
) {
  const finding = audit.findings.find(
    (candidate) => candidate.templateId === templateId,
  )

  return finding ? getFindingImpact(audit, finding) : null
}
