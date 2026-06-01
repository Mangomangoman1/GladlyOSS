import { describe, expect, it } from 'vitest'

import { DEMO_SNAPSHOT } from './audit'
import { generateTemplate, getTemplateDefinition } from './templates'

describe('generateTemplate', () => {
  it('interpolates repository details into the contributing guide', () => {
    const content = generateTemplate('contributing', DEMO_SNAPSHOT)

    expect(content).toContain('# Contributing to tiny-library')
    expect(content).toContain(
      'git clone https://github.com/open-garden/tiny-library.git',
    )
  })

  it('creates a security policy with a repository-specific issue URL', () => {
    const content = generateTemplate('security', DEMO_SNAPSHOT)

    expect(content).toContain(
      'https://github.com/open-garden/tiny-library/security/advisories/new',
    )
  })

  it('describes the selected template filename', () => {
    expect(getTemplateDefinition('pull-request-template')).toMatchObject({
      title: 'Pull request template',
      filename: '.github/PULL_REQUEST_TEMPLATE.md',
    })
  })
})
