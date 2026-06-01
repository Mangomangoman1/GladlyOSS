import { useCallback, useEffect, useState } from 'react'
import {
  Github,
  GitPullRequest,
  LoaderCircle,
  RefreshCw,
  Star,
} from 'lucide-react'

import { AuditOverview } from './components/AuditOverview'
import { RepoForm } from './components/RepoForm'
import { Sidebar } from './components/Sidebar'
import { TemplateWorkbench } from './components/TemplateWorkbench'
import {
  auditRepository,
  DEMO_SNAPSHOT,
  parseRepoInput,
  type RepositoryAudit,
  type TemplateId,
} from './lib/audit'
import { fetchRepositorySnapshot } from './lib/github'

const demoAudit = auditRepository(DEMO_SNAPSHOT)
const DEFAULT_TEMPLATE: TemplateId = 'contributing'

function relativeDate(value: string) {
  const distance = Date.now() - new Date(value).getTime()
  const minutes = Math.max(1, Math.round(distance / 60_000))

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `${hours} hr ago`
  }

  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function App() {
  const [audit, setAudit] = useState<RepositoryAudit>(demoAudit)
  const [repositoryInput, setRepositoryInput] = useState('')
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>(DEFAULT_TEMPLATE)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [auditLabel, setAuditLabel] = useState('Demo workspace')

  const runAudit = useCallback(async (input: string) => {
    setError(null)

    try {
      const reference = parseRepoInput(input)
      setIsLoading(true)
      const snapshot = await fetchRepositorySnapshot(reference)
      const nextAudit = auditRepository(snapshot)
      const firstImprovement = nextAudit.findings.find(
        (finding) => finding.status !== 'complete' && finding.templateId,
      )

      setAudit(nextAudit)
      setRepositoryInput(reference.slug)
      setSelectedTemplate(firstImprovement?.templateId ?? DEFAULT_TEMPLATE)
      setAuditLabel('Audited just now')

      const nextUrl = new URL(window.location.href)
      nextUrl.searchParams.set('repo', reference.slug)
      window.history.replaceState({}, '', nextUrl)
    } catch (auditError) {
      setError(
        auditError instanceof Error
          ? auditError.message
          : 'Something interrupted the audit. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const sharedRepository = new URLSearchParams(window.location.search).get(
      'repo',
    )
    if (sharedRepository) {
      void runAudit(sharedRepository)
    }
  }, [runAudit])

  const loadDemo = () => {
    setAudit(demoAudit)
    setRepositoryInput('')
    setSelectedTemplate(DEFAULT_TEMPLATE)
    setAuditLabel('Demo workspace')
    setError(null)

    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.delete('repo')
    window.history.replaceState({}, '', nextUrl)
  }

  const repository = audit.repository

  return (
    <div className="app-shell">
      <Sidebar onLoadDemo={loadDemo} />

      <main className="app-main">
        <header className="topbar">
          <div className="repository-identity">
            <div className="repo-mark" aria-hidden="true">
              <Github size={20} strokeWidth={2.2} />
            </div>
            <div>
              <a
                className="repository-name"
                href={repository.htmlUrl}
                rel="noreferrer"
                target="_blank"
              >
                {repository.owner} <span>/</span> {repository.name}
              </a>
              <p>
                {auditLabel}
                <span aria-hidden="true"> · </span>
                updated {relativeDate(repository.updatedAt)}
              </p>
            </div>
          </div>

          <div className="topbar-stat">
            <Star size={15} />
            <span>{repository.stars.toLocaleString()}</span>
          </div>
          <div className="topbar-stat">
            <GitPullRequest size={15} />
            <span>{repository.openIssues} open</span>
          </div>

          <button
            className="refresh-button"
            type="button"
            onClick={() =>
              repositoryInput
                ? void runAudit(repositoryInput)
                : loadDemo()
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <RefreshCw size={17} />
            )}
            Refresh audit
          </button>
        </header>

        <RepoForm
          error={error}
          isLoading={isLoading}
          onChange={setRepositoryInput}
          onLoadDemo={loadDemo}
          onSubmit={runAudit}
          value={repositoryInput}
        />

        <AuditOverview
          audit={audit}
          onSelectTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
        />

        <TemplateWorkbench
          audit={audit}
          onSelectTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
        />
      </main>
    </div>
  )
}

export default App
