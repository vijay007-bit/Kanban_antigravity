import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddCardModal } from '../AddCardModal'

describe('AddCardModal Component', () => {
  it('does not render when isOpen is false or columnId is null', () => {
    const { rerender } = render(
      <AddCardModal
        isOpen={false}
        columnId="col-todo"
        columnTitle="To Do"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    expect(screen.queryByTestId('add-card-modal')).not.toBeInTheDocument()

    rerender(
      <AddCardModal
        isOpen={true}
        columnId={null}
        columnTitle="To Do"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    expect(screen.queryByTestId('add-card-modal')).not.toBeInTheDocument()
  })

  it('renders correctly when open and handles form submission', () => {
    const onSubmit = vi.fn().mockReturnValue(true)
    const onClose = vi.fn()

    render(
      <AddCardModal
        isOpen={true}
        columnId="col-todo"
        columnTitle="To Do"
        onClose={onClose}
        onSubmit={onSubmit}
      />
    )

    expect(screen.getByTestId('add-card-modal')).toBeInTheDocument()
    expect(screen.getByText('Add New Card to To Do')).toBeInTheDocument()

    const titleInput = screen.getByTestId('input-card-title')
    const detailsInput = screen.getByTestId('input-card-details')
    const submitBtn = screen.getByTestId('btn-submit-card')

    fireEvent.change(titleInput, { target: { value: 'Refactor Auth Pipeline' } })
    fireEvent.change(detailsInput, { target: { value: 'Switch token generation to EdDSA' } })
    fireEvent.click(submitBtn)

    expect(onSubmit).toHaveBeenCalledWith('col-todo', 'Refactor Auth Pipeline', 'Switch token generation to EdDSA')
    expect(onClose).toHaveBeenCalled()
  })

  it('shows error validation if title is empty', () => {
    const onSubmit = vi.fn()
    const onClose = vi.fn()

    render(
      <AddCardModal
        isOpen={true}
        columnId="col-todo"
        columnTitle="To Do"
        onClose={onClose}
        onSubmit={onSubmit}
      />
    )

    const submitBtn = screen.getByTestId('btn-submit-card')
    fireEvent.click(submitBtn)

    expect(screen.getByText('Card title is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('handles failed onSubmit returning false', () => {
    const onSubmit = vi.fn().mockReturnValue(false)
    const onClose = vi.fn()

    render(
      <AddCardModal
        isOpen={true}
        columnId="col-todo"
        columnTitle="To Do"
        onClose={onClose}
        onSubmit={onSubmit}
      />
    )

    const titleInput = screen.getByTestId('input-card-title')
    const submitBtn = screen.getByTestId('btn-submit-card')

    fireEvent.change(titleInput, { target: { value: 'Some Title' } })
    fireEvent.click(submitBtn)

    expect(screen.getByText('Failed to create card. Please check input.')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when clicking close or cancel button or pressing Escape key', () => {
    const onClose = vi.fn()

    render(
      <AddCardModal
        isOpen={true}
        columnId="col-todo"
        columnTitle="To Do"
        onClose={onClose}
        onSubmit={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('btn-close-modal'))
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTestId('btn-cancel-modal'))
    expect(onClose).toHaveBeenCalledTimes(2)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(3)
  })
})
