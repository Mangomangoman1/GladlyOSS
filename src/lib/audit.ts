export type AuditCategory = 'essentials' | 'collaboration' | 'stewardship'
export type FindingStatus = 'complete' | 'missing' | 'recommended'

export interface RepositorySnapshot {
  owner: string
  name: string
  description: string | null
  defaultBranch: string
  htmlUrl: string
  stars: number
  forks: number
  openIssues: number
  language: string | null
  updatedAt: string
  files: string[]
}

export interface RepositoryReference {
  owner: string
  name: string
  slug: string
}

export interface AuditFinding {
  id: AuditRuleId
  title: string
  shortTitle: string
  description: string
  category: AuditCategory
  weight: number
  status: FindingStatus
  matchedPath: string | null
  templateId: TemplateId | null
}

export interface AuditBreakdownItem {
  earned: number
  total: number
  percentage: number
}

export interface RepositoryAudit {
  repository: RepositorySnapshot
  score: number
  grade: string
  summary: string
  findings: AuditFinding[]
  breakdown: Record<AuditCategory, AuditBreakdownItem>
}

export type TemplateId =
  | 'readme'
  | 'license'
  | 'contributing'
  | 'code-of-conduct'
  | 'security'
  | 'issue-template'
  | 'pull-request-template'
  | 'changelog'

type AuditRuleId =
  | TemplateId
  | 'description'

interface AuditRule {
  id: AuditRuleId
  title: string
  shortTitle: string
  description: string
  category: AuditCategory
  weight: number
  required: boolean
  templateId: TemplateId | null
  match: (snapshot: RepositorySnapshot) => string | null
}

const INVALID_REPOSITORY_MESSAGE =
  'Enter a GitHub repository as owner/name or paste its GitHub URL.'

const byAcceptedPath =
  (acceptedPaths: string[]) =>
  (snapshot: RepositorySnapshot): string | null => {
    const filesByLowercasePath = new Map(
      snapshot.files.map((path) => [path.toLowerCase(), path]),
    )

    for (const acceptedPath of acceptedPaths) {
      const matchedPath = filesByLowercasePath.get(acceptedPath.toLowerCase())
      if (matchedPath) {
        return matchedPath
      }
    }

    return null
  }

const byPathPrefix =
  (prefix: string) =>
  (snapshot: RepositorySnapshot): string | null => {
    const lowercasePrefix = prefix.toLowerCase()
    return (
      snapshot.files.find((path) => path.toLowerCase().startsWith(lowercasePrefix)) ??
      null
    )
  }

export const AUDIT_RULES: AuditRule[] = [
  {
    id: 'readme',
    title: 'README',
    shortTitle: 'README',
    description: 'Explain what the project does and help new visitors get started.',
    category: 'essentials',
    weight: 20,
    required: true,
    templateId: 'readme',
    match: byAcceptedPath(['README.md', 'README', 'README.rst']),
  },
  {
    id: 'license',
    title: 'License',
    shortTitle: 'License',
    description: 'Tell people how they may use, modify, and share the project.',
    category: 'essentials',
    weight: 15,
    required: true,
    templateId: 'license',
    match: byAcceptedPath(['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING']),
  },
  {
    id: 'contributing',
    title: 'Contributing guide',
    shortTitle: 'Contributing',
    description: 'Turn interest into a clear first contribution path.',
    category: 'collaboration',
    weight: 15,
    required: true,
    templateId: 'contributing',
    match: byAcceptedPath(['CONTRIBUTING.md', '.github/CONTRIBUTING.md']),
  },
  {
    id: 'pull-request-template',
    title: 'Pull request template',
    shortTitle: 'Pull requests',
    description: 'Prompt contributors to explain and verify every proposed change.',
    category: 'collaboration',
    weight: 10,
    required: true,
    templateId: 'pull-request-template',
    match: byAcceptedPath([
      '.github/PULL_REQUEST_TEMPLATE.md',
      'PULL_REQUEST_TEMPLATE.md',
    ]),
  },
  {
    id: 'code-of-conduct',
    title: 'Code of conduct',
    shortTitle: 'Conduct',
    description: 'Set a welcoming standard for participation in your community.',
    category: 'collaboration',
    weight: 10,
    required: false,
    templateId: 'code-of-conduct',
    match: byAcceptedPath([
      'CODE_OF_CONDUCT.md',
      '.github/CODE_OF_CONDUCT.md',
    ]),
  },
  {
    id: 'issue-template',
    title: 'Issue templates',
    shortTitle: 'Issues',
    description: 'Collect the context maintainers need when someone opens an issue.',
    category: 'collaboration',
    weight: 10,
    required: false,
    templateId: 'issue-template',
    match: byPathPrefix('.github/ISSUE_TEMPLATE/'),
  },
  {
    id: 'security',
    title: 'Security policy',
    shortTitle: 'Security',
    description: 'Give responsible reporters a private path for sensitive findings.',
    category: 'stewardship',
    weight: 10,
    required: false,
    templateId: 'security',
    match: byAcceptedPath(['SECURITY.md', '.github/SECURITY.md']),
  },
  {
    id: 'description',
    title: 'Repository description',
    shortTitle: 'Description',
    description: 'Add a concise GitHub description so visitors know why the project exists.',
    category: 'essentials',
    weight: 5,
    required: false,
    templateId: null,
    match: (snapshot) => snapshot.description?.trim() || null,
  },
  {
    id: 'changelog',
    title: 'Changelog',
    shortTitle: 'Changelog',
    description: 'Keep a human-readable record of meaningful improvements over time.',
    category: 'stewardship',
    weight: 5,
    required: false,
    templateId: 'changelog',
    match: byAcceptedPath(['CHANGELOG.md', 'HISTORY.md', 'RELEASES.md']),
  },
]

const categories: AuditCategory[] = [
  'essentials',
  'collaboration',
  'stewardship',
]

const statusRank: Record<FindingStatus, number> = {
  missing: 0,
  recommended: 1,
  complete: 2,
}

function roundPercentage(earned: number, total: number) {
  return Math.round((earned / total) * 100)
}

function getGrade(score: number) {
  if (score >= 85) {
    return {
      grade: 'Ready to welcome contributors',
      summary:
        'Your foundations are in place. Keep the details current as your community grows.',
    }
  }

  if (score >= 60) {
    return {
      grade: 'A strong start',
      summary:
        'Your repository is on the right track. A few focused improvements will make it easier to join.',
    }
  }

  return {
    grade: 'A few foundations first',
    summary:
      'Start with the highest-priority items. Each one removes uncertainty for future contributors.',
  }
}

export function parseRepoInput(value: string): RepositoryReference {
  const trimmedValue = value.trim().replace(/\/+$/, '')
  const withoutGitSuffix = trimmedValue.replace(/\.git$/i, '')
  const urlMatch = withoutGitSuffix.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)(?:\/.*)?$/i,
  )
  const slugMatch = withoutGitSuffix.match(/^([^/\s]+)\/([^/\s]+)$/)
  const match = urlMatch ?? slugMatch

  if (!match) {
    throw new Error(INVALID_REPOSITORY_MESSAGE)
  }

  const [, owner, name] = match
  if (!owner || !name || owner === '.' || name === '.') {
    throw new Error(INVALID_REPOSITORY_MESSAGE)
  }

  return {
    owner,
    name,
    slug: `${owner}/${name}`,
  }
}

export function auditRepository(snapshot: RepositorySnapshot): RepositoryAudit {
  const findings = AUDIT_RULES.map((rule): AuditFinding => {
    const matchedPath = rule.match(snapshot)
    return {
      id: rule.id,
      title: rule.title,
      shortTitle: rule.shortTitle,
      description: rule.description,
      category: rule.category,
      weight: rule.weight,
      status: matchedPath ? 'complete' : rule.required ? 'missing' : 'recommended',
      matchedPath,
      templateId: rule.templateId,
    }
  }).sort((firstFinding, secondFinding) => {
    return (
      statusRank[firstFinding.status] - statusRank[secondFinding.status] ||
      secondFinding.weight - firstFinding.weight
    )
  })

  const score = findings.reduce(
    (total, finding) =>
      total + (finding.status === 'complete' ? finding.weight : 0),
    0,
  )

  const breakdown = Object.fromEntries(
    categories.map((category) => {
      const categoryFindings = findings.filter(
        (finding) => finding.category === category,
      )
      const total = categoryFindings.reduce(
        (sum, finding) => sum + finding.weight,
        0,
      )
      const earned = categoryFindings.reduce(
        (sum, finding) =>
          sum + (finding.status === 'complete' ? finding.weight : 0),
        0,
      )

      return [
        category,
        {
          earned,
          total,
          percentage: roundPercentage(earned, total),
        },
      ]
    }),
  ) as Record<AuditCategory, AuditBreakdownItem>

  return {
    repository: snapshot,
    score,
    ...getGrade(score),
    findings,
    breakdown,
  }
}

export const DEMO_SNAPSHOT: RepositorySnapshot = {
  owner: 'open-garden',
  name: 'tiny-library',
  description: 'A tiny library for growing thoughtful open-source projects.',
  defaultBranch: 'main',
  htmlUrl: 'https://github.com/open-garden/tiny-library',
  stars: 248,
  forks: 31,
  openIssues: 12,
  language: 'TypeScript',
  updatedAt: '2026-05-31T21:14:00Z',
  files: [
    'README.md',
    'LICENSE',
    'CODE_OF_CONDUCT.md',
    '.github/ISSUE_TEMPLATE/bug_report.yml',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'CHANGELOG.md',
  ],
}
