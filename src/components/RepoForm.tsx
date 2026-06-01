import { Github, LoaderCircle, Play, Search } from 'lucide-react'
import type { FormEvent } from 'react'

interface RepoFormProps {
  error: string | null
  isLoading: boolean
  onChange: (value: string) => void
  onLoadDemo: () => void
  onSubmit: (value: string) => Promise<void>
  value: string
}

export function RepoForm({
  error,
  isLoading,
  onChange,
  onLoadDemo,
  onSubmit,
  value,
}: RepoFormProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onSubmit(value)
  }

  return (
    <section className="audit-entry" aria-labelledby="audit-entry-title">
      <div className="audit-entry-copy">
        <p className="section-label">Repository readiness</p>
        <h1 id="audit-entry-title">Make your project easier to join.</h1>
        <p>
          Audit a public GitHub repository, find the highest-impact gaps, and
          leave with thoughtful starter files.
        </p>
      </div>

      <form
        aria-label="Audit a repository"
        className="repo-form"
        onSubmit={submit}
      >
        <div className="repo-input-wrap">
          <Github aria-hidden="true" size={18} />
          <input
            aria-label="GitHub repository"
            autoComplete="off"
            onChange={(event) => onChange(event.target.value)}
            placeholder="owner/repository or GitHub URL"
            type="text"
            value={value}
          />
        </div>
        <button className="primary-button" disabled={isLoading} type="submit">
          {isLoading ? (
            <LoaderCircle className="spin" size={17} />
          ) : (
            <Search size={17} />
          )}
          {isLoading ? 'Auditing…' : 'Audit repository'}
        </button>
        <button className="secondary-button" type="button" onClick={onLoadDemo}>
          <Play size={16} />
          Try the demo
        </button>
        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </section>
  )
}
