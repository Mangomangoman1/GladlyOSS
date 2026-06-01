import type {
  AuditCategory,
  AuditFinding,
  FindingStatus,
  RepositoryAudit,
} from './audit'

const categoryLabels: Record<AuditCategory, string> = {
  essentials: 'Essentials',
  collaboration: 'Collaboration',
  stewardship: 'Stewardship',
}

const categoryOrder: AuditCategory[] = [
  'essentials',
  'collaboration',
  'stewardship',
]

const statusLabels: Record<FindingStatus, string> = {
  complete: 'Complete',
  missing: 'Missing',
  recommended: 'Recommended',
}

function checklistLine(finding: AuditFinding) {
  const marker = finding.status === 'complete' ? 'x' : ' '
  return `- [${marker}] ${finding.title} — ${statusLabels[finding.status]}`
}

function nextStepsSection(findings: AuditFinding[]) {
  const incompleteFindings = findings.filter(
    (finding) => finding.status !== 'complete',
  )

  if (incompleteFindings.length === 0) {
    return 'No immediate readiness gaps found.'
  }

  return incompleteFindings
    .map(
      (finding, index) =>
        `${index + 1}. **${finding.title}** — ${finding.description}`,
    )
    .join('\n')
}

export function generateReadinessReport(
  audit: RepositoryAudit,
  shareUrl: string,
) {
  const { repository } = audit
  const breakdownRows = categoryOrder.map((category) => {
    const breakdown = audit.breakdown[category]
    return `| ${categoryLabels[category]} | ${breakdown.earned}/${breakdown.total} | ${breakdown.percentage}% |`
  })

  return `# ${repository.name} open-source readiness report

Generated with [Gladly](${shareUrl}) for [${repository.owner}/${repository.name}](${repository.htmlUrl}).

## Readiness score

**${audit.score}/100** — ${audit.grade}

${audit.summary}

## Category breakdown

| Category | Points | Progress |
| --- | ---: | ---: |
${breakdownRows.join('\n')}

## Checklist

${audit.findings.map(checklistLine).join('\n')}

## Best next steps

${nextStepsSection(audit.findings)}

---

[Open this audit in Gladly](${shareUrl})
`
}

export function getReportFilename(audit: RepositoryAudit) {
  return `${audit.repository.name.toLowerCase()}-gladly-report.md`
}
