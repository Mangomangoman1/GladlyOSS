import { describe, expect, it, vi } from 'vitest'

import { fetchRepositorySnapshot } from './github'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

describe('fetchRepositorySnapshot', () => {
  it('maps repository metadata and community-health paths from GitHub responses', async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.endsWith('/repos/with-heart/project')) {
        return jsonResponse({
          name: 'project',
          owner: { login: 'with-heart' },
          description: 'A welcoming project.',
          default_branch: 'main',
          html_url: 'https://github.com/with-heart/project',
          stargazers_count: 42,
          forks_count: 7,
          open_issues_count: 3,
          language: 'TypeScript',
          updated_at: '2026-05-30T12:00:00Z',
        })
      }

      if (url.endsWith('/contents')) {
        return jsonResponse([{ path: 'README.md' }, { path: 'LICENSE' }])
      }

      if (url.endsWith('/contents/.github')) {
        return jsonResponse([
          { path: '.github/CONTRIBUTING.md' },
          { path: '.github/PULL_REQUEST_TEMPLATE.md' },
        ])
      }

      if (url.endsWith('/contents/.github/ISSUE_TEMPLATE')) {
        return jsonResponse([
          { path: '.github/ISSUE_TEMPLATE/bug_report.yml' },
        ])
      }

      return jsonResponse({ message: 'Not Found' }, 404)
    })

    const snapshot = await fetchRepositorySnapshot(
      { owner: 'with-heart', name: 'project', slug: 'with-heart/project' },
      fetcher,
    )

    expect(snapshot).toMatchObject({
      owner: 'with-heart',
      name: 'project',
      description: 'A welcoming project.',
      stars: 42,
      files: [
        'README.md',
        'LICENSE',
        '.github/CONTRIBUTING.md',
        '.github/PULL_REQUEST_TEMPLATE.md',
        '.github/ISSUE_TEMPLATE/bug_report.yml',
      ],
    })
  })

  it('treats missing optional .github directories as an empty file list', async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.endsWith('/repos/with-heart/project')) {
        return jsonResponse({
          name: 'project',
          owner: { login: 'with-heart' },
          description: null,
          default_branch: 'main',
          html_url: 'https://github.com/with-heart/project',
          stargazers_count: 0,
          forks_count: 0,
          open_issues_count: 0,
          language: null,
          updated_at: '2026-05-30T12:00:00Z',
        })
      }

      if (url.endsWith('/contents')) {
        return jsonResponse([{ path: 'README.md' }])
      }

      return jsonResponse({ message: 'Not Found' }, 404)
    })

    const snapshot = await fetchRepositorySnapshot(
      { owner: 'with-heart', name: 'project', slug: 'with-heart/project' },
      fetcher,
    )

    expect(snapshot.files).toEqual(['README.md'])
  })

  it('returns a plain-language message when the repository is not found', async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse({ message: 'Not Found' }, 404),
    )

    await expect(
      fetchRepositorySnapshot(
        { owner: 'missing', name: 'project', slug: 'missing/project' },
        fetcher,
      ),
    ).rejects.toThrow(
      'We could not find missing/project. Check that the repository is public and the URL is correct.',
    )
  })
})
