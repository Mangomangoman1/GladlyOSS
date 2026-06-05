import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  CircleDotDashed,
  Clipboard,
  Download,
  FileText,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import type {
  AuditFinding,
  RepositoryAudit,
  TemplateId,
} from '../lib/audit'
import { getTemplateImpact } from '../lib/impact'
import {
  generateTemplate,
  getTemplateDefinition,
} from '../lib/templates'

interface TemplateWorkbenchProps {
  audit: RepositoryAudit
  onSelectTemplate: (templateId: TemplateId) => void
  selectedTemplate: TemplateId
}

function downloadTextFile(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function TemplateRailItem({
  finding,
  isSelected,
  onSelect,
}: {
  finding: AuditFinding
  isSelected: boolean
  onSelect: (templateId: TemplateId) => void
}) {
  if (!finding.templateId) {
    return null
  }

  return (
    <button
      className={`template-rail-item${
        isSelected ? ' template-rail-item-selected' : ''
      }`}
      onClick={() => onSelect(finding.templateId!)}
      type="button"
    >
      <FileText aria-hidden="true" size={16} />
      <span>{finding.shortTitle}</span>
      {finding.status === 'complete' ? (
        <Check className="rail-status-complete" size={15} />
      ) : (
        <CircleDotDashed className="rail-status-open" size={15} />
      )}
    </button>
  )
}

export function TemplateWorkbench({
  audit,
  onSelectTemplate,
  selectedTemplate,
}: TemplateWorkbenchProps) {
  const generatedTemplate = useMemo(
    () => generateTemplate(selectedTemplate, audit.repository),
    [audit.repository, selectedTemplate],
  )
  const [content, setContent] = useState(generatedTemplate)
  const [feedback, setFeedback] = useState('Ready to customize')
  const definition = getTemplateDefinition(selectedTemplate)
  const impact = useMemo(
    () => getTemplateImpact(audit, selectedTemplate),
    [audit, selectedTemplate],
  )

  useEffect(() => {
    setContent(generatedTemplate)
    setFeedback('Ready to customize')
  }, [generatedTemplate])

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setFeedback('Copied to clipboard')
    } catch {
      setFeedback('Select the text and copy it manually')
    }
  }

  const resetContent = () => {
    setContent(generatedTemplate)
    setFeedback('Template reset')
  }

  return (
    <section className="workbench" id="templates">
      <div className="template-rail">
        <div>
          <p className="section-label">Starter files</p>
          <h2>Template workbench</h2>
          <p className="rail-description">
            Choose a file, make it yours, then add it to your repository.
          </p>
        </div>

        <div className="template-rail-list">
          {audit.findings.map((finding) => (
            <TemplateRailItem
              finding={finding}
              isSelected={finding.templateId === selectedTemplate}
              key={finding.id}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      </div>

      <div className="editor-panel">
        <div className="editor-toolbar">
          <div>
            <p className="section-label">Editing starter</p>
            <h2>{definition.title}</h2>
            <span className="filename">{definition.filename}</span>
          </div>

          <div className="editor-actions">
            <button className="icon-button" type="button" onClick={resetContent}>
              <RotateCcw size={16} />
              Reset
            </button>
            <button className="icon-button" type="button" onClick={copyContent}>
              <Clipboard size={16} />
              Copy
            </button>
            <button
              className="download-button"
              type="button"
              onClick={() => {
                downloadTextFile(definition.filename, content)
                setFeedback('Download started')
              }}
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <textarea
          aria-label={`Edit ${definition.title}`}
          className="template-editor"
          onChange={(event) => {
            setContent(event.target.value)
            setFeedback('Edited locally')
          }}
          spellCheck="false"
          value={content}
        />
        <p className="editor-feedback">{feedback}</p>
      </div>

      <aside className="workbench-note">
        <div className="note-icon">
          <Sparkles aria-hidden="true" size={18} />
        </div>
        <p className="section-label">Why this matters</p>
        <h2>{definition.title}</h2>
        <p>{definition.description}</p>
        {impact ? (
          <div
            className={`impact-note${
              impact.isComplete ? ' impact-note-complete' : ''
            }`}
          >
            <TrendingUp aria-hidden="true" size={16} />
            <span>{impact.impactLabel}</span>
            <strong>{impact.scoreLabel}</strong>
            <p>{impact.detail}</p>
          </div>
        ) : null}
        <div className="local-note">
          <Check aria-hidden="true" size={15} />
          <span>Everything stays in your browser.</span>
        </div>
      </aside>
    </section>
  )
}
