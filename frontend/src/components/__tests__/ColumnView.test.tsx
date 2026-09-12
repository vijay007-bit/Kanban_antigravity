import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DragDropContext } from '@hello-pangea/dnd'
import { ColumnView } from '../ColumnView'
import type { Column, Card } from '../../models/types'

const mockCards: Record<string, Card> = {
  'card-1': {
    id: 'card-1',
    title: 'First Card',
    details: 'First Card Details',
    createdAt: 1700000000000,
  },
  'card-2': {
    id: 'card-2',
    title: 'Second Card',
    details: 'Second Card Details',
    createdAt: 1700000000000,
  },
}

const mockColumn: Column = {
  id: 'col-todo',
  title: 'To Do',
  cardIds: ['card-1', 'card-2'],
}

const renderColumnWithDnd = (ui: React.ReactNode) => {
  return render(
    <DragDropContext onDragEnd={vi.fn()}>
      {ui}
    </DragDropContext>
  )
}

describe('ColumnView Component', () => {
  it('renders column title, counter badge, and child cards', () => {
    renderColumnWithDnd(
      <ColumnView
        column={mockColumn}
        cards={mockCards}
        onRename={vi.fn()}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    )

    expect(screen.getByTestId('column-title-col-todo')).toHaveTextContent('To Do')
    expect(screen.getByTestId('column-count-col-todo')).toHaveTextContent('2')
    expect(screen.getByText('First Card')).toBeInTheDocument()
    expect(screen.getByText('Second Card')).toBeInTheDocument()
  })

  it('renders empty placeholder when column has no cards', () => {
    const emptyCol: Column = {
      id: 'col-empty',
      title: 'Empty Column',
      cardIds: [],
    }

    renderColumnWithDnd(
      <ColumnView
        column={emptyCol}
        cards={{}}
        onRename={vi.fn()}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    )

    expect(screen.getByText('No cards in this column')).toBeInTheDocument()
  })

  it('enables inline editing and saves title on Enter or blur', () => {
    const onRename = vi.fn().mockReturnValue(true)

    renderColumnWithDnd(
      <ColumnView
        column={mockColumn}
        cards={mockCards}
        onRename={onRename}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    )

    // Click title to enter editing mode
    fireEvent.click(screen.getByTestId('column-title-col-todo'))
    const input = screen.getByTestId('column-title-input-col-todo')
    expect(input).toBeInTheDocument()

    // Change title and press Enter
    fireEvent.change(input, { target: { value: 'Tasks To Do' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onRename).toHaveBeenCalledWith('col-todo', 'Tasks To Do')
  })

  it('reverts title when onRename returns false', () => {
    const onRename = vi.fn().mockReturnValue(false)

    renderColumnWithDnd(
      <ColumnView
        column={mockColumn}
        cards={mockCards}
        onRename={onRename}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('column-title-col-todo'))
    const input = screen.getByTestId('column-title-input-col-todo')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input)

    expect(onRename).toHaveBeenCalledWith('col-todo', '   ')
    expect(screen.getByTestId('column-title-col-todo')).toHaveTextContent('To Do')
  })

  it('cancels inline editing on Escape key without renaming', () => {
    const onRename = vi.fn()

    renderColumnWithDnd(
      <ColumnView
        column={mockColumn}
        cards={mockCards}
        onRename={onRename}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('column-title-col-todo'))
    const input = screen.getByTestId('column-title-input-col-todo')

    fireEvent.change(input, { target: { value: 'Cancelled Title' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onRename).not.toHaveBeenCalled()
    expect(screen.getByTestId('column-title-col-todo')).toHaveTextContent('To Do')
  })

  it('triggers onOpenAddModal from both header and footer buttons', () => {
    const onOpenAddModal = vi.fn()

    renderColumnWithDnd(
      <ColumnView
        column={mockColumn}
        cards={mockCards}
        onRename={vi.fn()}
        onDeleteCard={vi.fn()}
        onOpenAddModal={onOpenAddModal}
      />
    )

    fireEvent.click(screen.getByTestId('btn-add-card-header-col-todo'))
    expect(onOpenAddModal).toHaveBeenCalledWith('col-todo')

    fireEvent.click(screen.getByTestId('btn-add-card-bottom-col-todo'))
    expect(onOpenAddModal).toHaveBeenCalledTimes(2)
  })
})
