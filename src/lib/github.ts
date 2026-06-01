import type {
  RepositoryReference,
  RepositorySnapshot,
} from './audit'

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

interface GitHubRepositoryResponse {
  name: string
  owner: { login: string }
  description: string | null
  default_branch: string
  html_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  updated_at: string
}

interface GitHubContentItem {
  path: string
}

const GITHUB_API = 'https://api.github.com'
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

async function fetchJson<T>(
  url: string,
  fetcher: Fetcher,
  optional = false,
): Promise<T | null> {
  const response = await fetcher(url, { headers })

  if (optional && response.status === 404) {
    return null
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        'GitHub is limiting unauthenticated requests right now. Try again in a few minutes.',
      )
    }

    throw new Error(`GitHub returned an unexpected ${response.status} response.`)
  }

  return (await response.json()) as T
}

function contentPaths(items: GitHubContentItem[] | null) {
  return items?.map((item) => item.path) ?? []
}

export async function fetchRepositorySnapshot(
  reference: RepositoryReference,
  fetcher: Fetcher = fetch,
): Promise<RepositorySnapshot> {
  const repositoryUrl = `${GITHUB_API}/repos/${reference.owner}/${reference.name}`
  const contentUrl = `${repositoryUrl}/contents`

  const [repositoryResponse, rootFiles, githubFiles, issueTemplateFiles] =
    await Promise.all([
      fetcher(repositoryUrl, { headers }),
      fetchJson<GitHubContentItem[]>(contentUrl, fetcher, true),
      fetchJson<GitHubContentItem[]>(`${contentUrl}/.github`, fetcher, true),
      fetchJson<GitHubContentItem[]>(
        `${contentUrl}/.github/ISSUE_TEMPLATE`,
        fetcher,
        true,
      ),
    ])

  if (repositoryResponse.status === 404) {
    throw new Error(
      `We could not find ${reference.slug}. Check that the repository is public and the URL is correct.`,
    )
  }

  if (repositoryResponse.status === 403) {
    throw new Error(
      'GitHub is limiting unauthenticated requests right now. Try again in a few minutes.',
    )
  }

  if (!repositoryResponse.ok) {
    throw new Error(
      `GitHub returned an unexpected ${repositoryResponse.status} response.`,
    )
  }

  const repository =
    (await repositoryResponse.json()) as GitHubRepositoryResponse

  return {
    owner: repository.owner.login,
    name: repository.name,
    description: repository.description,
    defaultBranch: repository.default_branch,
    htmlUrl: repository.html_url,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    openIssues: repository.open_issues_count,
    language: repository.language,
    updatedAt: repository.updated_at,
    files: [
      ...new Set([
        ...contentPaths(rootFiles),
        ...contentPaths(githubFiles),
        ...contentPaths(issueTemplateFiles),
      ]),
    ],
  }
}
