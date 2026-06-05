import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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

    expect(
      screen.getByRole('button', {
        name: /contributing guide: missing, 15 points available/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('+15 readiness impact')).toBeInTheDocument()
    expect(screen.getByText('Projected score 90/100')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /security policy/i }))

    expect(screen.getByText('SECURITY.md')).toBeInTheDocument()
    expect(screen.getByText('+10 readiness impact')).toBeInTheDocument()
    expect(screen.getByText('Projected score 85/100')).toBeInTheDocument()
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

  it('opens and closes a Markdown readiness report for the current audit', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /export report/i }))

    const dialog = screen.getByRole('dialog', { name: /readiness report/i })
    expect(dialog).toBeInTheDocument()
    expect(
      within(dialog).getByLabelText('Readiness score: 75 out of 100'),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole('heading', { name: 'Best next steps' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /close report/i }))

    expect(
      screen.queryByRole('dialog', { name: /readiness report/i }),
    ).not.toBeInTheDocument()
  })

  it('copies the Markdown report and confirms the action', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /export report/i }))
    fireEvent.click(screen.getByRole('button', { name: /copy markdown/i }))

    expect(await screen.findByText('Markdown copied')).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('# tiny-library open-source readiness report'),
    )
  })
})
