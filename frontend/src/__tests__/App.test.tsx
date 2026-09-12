import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App Root Component', () => {
  it('renders application with initial columns and cards', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Kanban Flow' })).toBeInTheDocument()
    expect(screen.getByText('5 Columns')).toBeInTheDocument()
    expect(screen.getByTestId('column-col-backlog')).toBeInTheDocument()
  })

  it('opens and closes add card modal and successfully adds a task', () => {
    render(<App />)

    // Click Add Card on To Do column
    fireEvent.click(screen.getByTestId('btn-add-card-bottom-col-todo'))
    expect(screen.getByTestId('add-card-modal')).toBeInTheDocument()

    // Fill form
    fireEvent.change(screen.getByTestId('input-card-title'), {
      target: { value: 'New Test Task' },
    })
    fireEvent.change(screen.getByTestId('input-card-details'), {
      target: { value: 'Task details here' },
    })
    fireEvent.click(screen.getByTestId('btn-submit-card'))

    // Verify modal closed and card is rendered
    expect(screen.queryByTestId('add-card-modal')).not.toBeInTheDocument()
    expect(screen.getByText('New Test Task')).toBeInTheDocument()
  })

  it('allows renaming a column directly from the UI', () => {
    render(<App />)

    const titleEl = screen.getByTestId('column-title-col-backlog')
    fireEvent.click(titleEl)

    const input = screen.getByTestId('column-title-input-col-backlog')
    fireEvent.change(input, { target: { value: 'Product Ideas' } })
    fireEvent.blur(input)

    expect(screen.getByTestId('column-title-col-backlog')).toHaveTextContent('Product Ideas')
  })
})
