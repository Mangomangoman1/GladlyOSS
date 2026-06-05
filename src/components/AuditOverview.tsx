import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDotDashed,
  GitFork,
  ShieldCheck,
  Star,
} from 'lucide-react'

import type {
  AuditCategory,
  AuditFinding,
  RepositoryAudit,
  TemplateId,
} from '../lib/audit'
import {
  getFindingImpact,
  type FindingImpact,
} from '../lib/impact'

interface AuditOverviewProps {
  audit: RepositoryAudit
  onSelectTemplate: (templateId: TemplateId) => void
  selectedTemplate: TemplateId
}

const categoryLabels: Record<AuditCategory, string> = {
  essentials: 'Essentials',
  collaboration: 'Collaboration',
  stewardship: 'Stewardship',
}

const statusLabels = {
  complete: 'Complete',
  missing: 'Missing',
  recommended: 'Recommended',
}

const statusIcons = {
  complete: CheckCircle2,
  missing: AlertCircle,
  recommended: CircleDotDashed,
}

function FindingRow({
  finding,
  impact,
  onSelectTemplate,
  selectedTemplate,
}: {
  finding: AuditFinding
  impact: FindingImpact
  onSelectTemplate: (templateId: TemplateId) => void
  selectedTemplate: TemplateId
}) {
  const Icon = statusIcons[finding.status]
  const isSelected = finding.templateId === selectedTemplate

  return (
    <button
      aria-label={`${finding.title}: ${statusLabels[finding.status]}${
        impact.points > 0 ? `, ${impact.points} points available` : ''
      }`}
      className={`finding-row${isSelected ? ' finding-row-selected' : ''}`}
      disabled={!finding.templateId}
      onClick={() => {
        if (finding.templateId) {
          onSelectTemplate(finding.templateId)
        }
      }}
      type="button"
    >
      <Icon
        aria-hidden="true"
        className={`finding-icon finding-icon-${finding.status}`}
        size={20}
      />
      <span className="finding-name">{finding.title}</span>
      <span className={`finding-status finding-status-${finding.status}`}>
        {statusLabels[finding.status]}
      </span>
      {impact.points > 0 ? (
        <span className="finding-impact">+{impact.points} pts</span>
      ) : (
        <span aria-hidden="true" className="finding-impact-placeholder" />
      )}
      <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
    </button>
  )
}

export function AuditOverview({
  audit,
  onSelectTemplate,
  selectedTemplate,
}: AuditOverviewProps) {
  const { repository } = audit

  return (
    <section className="overview-grid" id="overview">
      <div className="score-panel">
        <div
          aria-label={`Readiness score: ${audit.score} out of 100`}
          className="score-ring"
          style={{ '--score': audit.score } as React.CSSProperties}
        >
          <div className="score-ring-inner">
            <strong>{audit.score}</strong>
            <span>Readiness score</span>
          </div>
        </div>

        <div className="score-copy">
          <p className="section-label">Community health</p>
          <h2>{audit.grade}</h2>
          <p>{audit.summary}</p>

          <div className="repository-meta">
            <span>
              <Star aria-hidden="true" size={15} />
              {repository.stars.toLocaleString()} stars
            </span>
            <span>
              <GitFork aria-hidden="true" size={15} />
              {repository.forks.toLocaleString()} forks
            </span>
            <span>
              <ShieldCheck aria-hidden="true" size={15} />
              {repository.defaultBranch} branch
            </span>
          </div>

          <div className="breakdown-list">
            {Object.entries(audit.breakdown).map(([category, item]) => (
              <div className="breakdown-row" key={category}>
                <div>
                  <span>{categoryLabels[category as AuditCategory]}</span>
                  <small>
                    {item.earned}/{item.total}
                  </small>
                </div>
                <div className="breakdown-track">
                  <span style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="checklist-panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Best next steps</p>
            <h2>Prioritized checklist</h2>
          </div>
          <span>{audit.findings.filter((finding) => finding.status === 'complete').length}/9 ready</span>
        </div>

        <div className="finding-list">
          {audit.findings.map((finding) => (
            <FindingRow
              finding={finding}
              impact={getFindingImpact(audit, finding)}
              key={finding.id}
              onSelectTemplate={onSelectTemplate}
              selectedTemplate={selectedTemplate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
