import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('opens with an explorable demo repository audit', () => {
    render(<App />)

    expect(screen.getByText('Gladly')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /open-garden.*tiny-library/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('A strong start')).toBeInTheDocument()
  })

  it('shows the matching starter file when a finding is selected', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /security policy/i }))

    expect(screen.getByText('SECURITY.md')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(/Reporting a vulnerability/),
    ).toBeInTheDocument()
  })

  it('explains malformed repository input before requesting an audit', () => {
    render(<App />)

    fireEvent.change(
      screen.getByRole('textbox', { name: /github repository/i }),
      { target: { value: 'not-a-repository' } },
    )
    fireEvent.submit(screen.getByRole('form', { name: /audit a repository/i }))

    expect(
      screen.getByText(
        'Enter a GitHub repository as owner/name or paste its GitHub URL.',
      ),
    ).toBeInTheDocument()
  })

  it('lets maintainers edit and reset generated starter files locally', () => {
    render(<App />)

    const editor = screen.getByRole('textbox', {
      name: /edit contributing guide/i,
    })
    fireEvent.change(editor, { target: { value: '# My custom guide' } })

    expect(screen.getByDisplayValue('# My custom guide')).toBeInTheDocument()
    expect(screen.getByText('Edited locally')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /reset/i }))

    expect(
      screen.getByDisplayValue(/# Contributing to tiny-library/),
    ).toBeInTheDocument()
    expect(screen.getByText('Template reset')).toBeInTheDocument()
  })
})
