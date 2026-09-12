import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BoardView, processDragEnd } from '../BoardView'
import type { KanbanViewModel } from '../../viewmodels/useKanbanViewModel'
import { createInitialBoard } from '../../models/types'
import type { DropResult } from '@hello-pangea/dnd'

describe('BoardView Component', () => {
  const mockViewModel: KanbanViewModel = {
    board: createInitialBoard(),
    addCard: vi.fn(),
    deleteCard: vi.fn(),
    renameColumn: vi.fn(),
    moveCard: vi.fn(),
    modalState: {
      isOpen: false,
      targetColumnId: null,
      openModal: vi.fn(),
      closeModal: vi.fn(),
    },
  }

  it('renders all 5 board columns', () => {
    render(<BoardView viewModel={mockViewModel} />)

    expect(screen.getByTestId('kanban-board-container')).toBeInTheDocument()
    expect(screen.getByTestId('column-col-backlog')).toBeInTheDocument()
    expect(screen.getByTestId('column-col-todo')).toBeInTheDocument()
    expect(screen.getByTestId('column-col-in-progress')).toBeInTheDocument()
    expect(screen.getByTestId('column-col-review')).toBeInTheDocument()
    expect(screen.getByTestId('column-col-done')).toBeInTheDocument()
  })

  it('handles processDragEnd with null destination', () => {
    const moveCard = vi.fn()
    const result: DropResult = {
      draggableId: 'card-1',
      type: 'DEFAULT',
      source: { droppableId: 'col-backlog', index: 0 },
      destination: null,
      reason: 'CANCEL',
      mode: 'FLUID',
    }

    processDragEnd(result, moveCard)
    expect(moveCard).not.toHaveBeenCalled()
  })

  it('handles processDragEnd with same destination position', () => {
    const moveCard = vi.fn()
    const result: DropResult = {
      draggableId: 'card-1',
      type: 'DEFAULT',
      source: { droppableId: 'col-backlog', index: 1 },
      destination: { droppableId: 'col-backlog', index: 1 },
      reason: 'DROP',
      mode: 'FLUID',
    }

    processDragEnd(result, moveCard)
    expect(moveCard).not.toHaveBeenCalled()
  })

  it('calls moveCard on valid drag and drop destination', () => {
    const moveCard = vi.fn()
    const result: DropResult = {
      draggableId: 'card-1',
      type: 'DEFAULT',
      source: { droppableId: 'col-backlog', index: 0 },
      destination: { droppableId: 'col-todo', index: 2 },
      reason: 'DROP',
      mode: 'FLUID',
    }

    processDragEnd(result, moveCard)
    expect(moveCard).toHaveBeenCalledWith('col-backlog', 'col-todo', 0, 2)
  })
})
