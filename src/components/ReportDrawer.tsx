import { useMemo, useState } from 'react'
import {
  Check,
  Clipboard,
  Download,
  ExternalLink,
  Link2,
  X,
} from 'lucide-react'

import type { AuditCategory, RepositoryAudit } from '../lib/audit'
import {
  generateReadinessReport,
  getReportFilename,
} from '../lib/report'

interface ReportDrawerProps {
  audit: RepositoryAudit
  onClose: () => void
  shareUrl: string
}

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

function downloadMarkdown(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function ReportDrawer({ audit, onClose, shareUrl }: ReportDrawerProps) {
  const report = useMemo(
    () => generateReadinessReport(audit, shareUrl),
    [audit, shareUrl],
  )
  const [feedback, setFeedback] = useState('Ready to share')
  const incompleteFindings = audit.findings.filter(
    (finding) => finding.status !== 'complete',
  )

  const copyText = async (content: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setFeedback(successMessage)
    } catch {
      setFeedback('Clipboard unavailable — download the Markdown instead')
    }
  }

  return (
    <div className="report-layer">
      <button
        aria-label="Dismiss report"
        className="report-backdrop"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Readiness report"
        aria-modal="true"
        className="report-drawer"
        role="dialog"
      >
        <header className="report-header">
          <div>
            <p className="section-label">Shareable artifact</p>
            <h2>Readiness report</h2>
            <p>
              A clear maintainer brief for{' '}
              <strong>{audit.repository.name}</strong>.
            </p>
          </div>
          <button
            aria-label="Close report"
            className="report-close"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </header>

        <div
          aria-label={`Readiness score: ${audit.score} out of 100`}
          className="report-score"
        >
          <div>
            <strong>{audit.score}</strong>
            <span>/100</span>
          </div>
          <p>{audit.grade}</p>
        </div>

        <div className="report-breakdown">
          {categoryOrder.map((category) => {
            const breakdown = audit.breakdown[category]
            return (
              <div className="report-breakdown-item" key={category}>
                <span>{categoryLabels[category]}</span>
                <strong>
                  {breakdown.earned}/{breakdown.total}
                </strong>
              </div>
            )
          })}
        </div>

        <section className="report-next-steps">
          <p className="section-label">Maintainer brief</p>
          <h3>Best next steps</h3>
          {incompleteFindings.length > 0 ? (
            <ol>
              {incompleteFindings.map((finding) => (
                <li key={finding.id}>
                  <strong>{finding.title}</strong>
                  <span>{finding.description}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="report-complete">
              <Check aria-hidden="true" size={17} />
              No immediate readiness gaps found.
            </p>
          )}
        </section>

        <section className="report-preview">
          <div className="report-preview-heading">
            <div>
              <p className="section-label">Markdown preview</p>
              <h3>{getReportFilename(audit)}</h3>
            </div>
            <a href={shareUrl} rel="noreferrer" target="_blank">
              Open audit
              <ExternalLink aria-hidden="true" size={13} />
            </a>
          </div>
          <pre>{report}</pre>
        </section>

        <footer className="report-footer">
          <p>{feedback}</p>
          <div>
            <button
              className="icon-button"
              onClick={() => void copyText(shareUrl, 'Share link copied')}
              type="button"
            >
              <Link2 aria-hidden="true" size={16} />
              Copy share link
            </button>
            <button
              className="icon-button"
              onClick={() => void copyText(report, 'Markdown copied')}
              type="button"
            >
              <Clipboard aria-hidden="true" size={16} />
              Copy Markdown
            </button>
            <button
              className="download-button"
              onClick={() => {
                downloadMarkdown(getReportFilename(audit), report)
                setFeedback('Download started')
              }}
              type="button"
            >
              <Download aria-hidden="true" size={16} />
              Download .md
            </button>
          </div>
        </footer>
      </aside>
    </div>
  )
}
