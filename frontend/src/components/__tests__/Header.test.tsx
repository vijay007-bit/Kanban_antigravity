import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

describe('Header Component', () => {
  it('renders application branding and correct task stats', () => {
    render(
      <Header
        boardTitle="Sprint Planning"
        totalCards={8}
        columnCount={5}
      />
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Kanban Flow' })).toBeInTheDocument()
    expect(screen.getByText('Sprint Planning')).toBeInTheDocument()
    expect(screen.getByText('5 Columns')).toBeInTheDocument()
    expect(screen.getByText('8 Total Tasks')).toBeInTheDocument()
  })
})
