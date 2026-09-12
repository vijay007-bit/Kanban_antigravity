import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKanbanViewModel } from '../useKanbanViewModel'
import { createInitialBoard } from '../../models/types'

describe('useKanbanViewModel', () => {
  it('initializes with 5 columns and initial sample cards', () => {
    const { result } = renderHook(() => useKanbanViewModel())
    expect(result.current.board.columns).toHaveLength(5)
    expect(result.current.board.columns.map((c) => c.title)).toEqual([
      'Backlog',
      'To Do',
      'In Progress',
      'Review',
      'Done',
    ])
    expect(Object.keys(result.current.board.cards).length).toBeGreaterThan(0)
  })

  it('adds a new card to a specific column', () => {
    const { result } = renderHook(() => useKanbanViewModel())
    const initialColCount = result.current.board.columns[0].cardIds.length

    act(() => {
      const success = result.current.addCard(
        'col-backlog',
        'New Feature Spec',
        'Detailed requirements for new feature'
      )
      expect(success).toBe(true)
    })

    const updatedCol = result.current.board.columns[0]
    expect(updatedCol.cardIds.length).toBe(initialColCount + 1)
    const newCardId = updatedCol.cardIds[updatedCol.cardIds.length - 1]
    const newCard = result.current.board.cards[newCardId]
    expect(newCard.title).toBe('New Feature Spec')
    expect(newCard.details).toBe('Detailed requirements for new feature')
  })

  it('rejects adding a card with an empty title', () => {
    const { result } = renderHook(() => useKanbanViewModel())
    let success = true

    act(() => {
      success = result.current.addCard('col-backlog', '   ', 'Some details')
    })

    expect(success).toBe(false)
  })

  it('handles adding a card to an invalid column gracefully', () => {
    const { result } = renderHook(() => useKanbanViewModel())
    act(() => {
      result.current.addCard('col-invalid', 'Valid Title', 'Details')
    })
    expect(result.current.board.columns.some((c) => c.id === 'col-invalid')).toBe(false)
  })

  it('deletes an existing card from board and column', () => {
    const { result } = renderHook(() => useKanbanViewModel())
    const targetCardId = result.current.board.columns[0].cardIds[0]

    expect(result.current.board.cards[targetCardId]).toBeDefined()

    act(() => {
      result.current.deleteCard(targetCardId, 'col-backlog')
    })

    expect(result.current.board.cards[targetCardId]).toBeUndefined()
    expect(result.current.board.columns[0].cardIds).not.toContain(targetCardId)
  })

  it('renames a column successfully', () => {
    const { result } = renderHook(() => useKanbanViewModel())

    act(() => {
      const success = result.current.renameColumn('col-backlog', 'Sprint Backlog')
      expect(success).toBe(true)
    })

    expect(result.current.board.columns[0].title).toBe('Sprint Backlog')
  })

  it('rejects renaming a column with empty whitespace', () => {
    const { result } = renderHook(() => useKanbanViewModel())

    act(() => {
      const success = result.current.renameColumn('col-backlog', '   ')
      expect(success).toBe(false)
    })

    expect(result.current.board.columns[0].title).toBe('Backlog')
  })

  it('reorders cards within the same column', () => {
    const initialBoard = createInitialBoard()
    initialBoard.columns[0].cardIds = ['card-1', 'card-2']

    const { result } = renderHook(() => useKanbanViewModel(initialBoard))

    act(() => {
      result.current.moveCard('col-backlog', 'col-backlog', 0, 1)
    })

    expect(result.current.board.columns[0].cardIds).toEqual(['card-2', 'card-1'])
  })

  it('moves a card across columns', () => {
    const initialBoard = createInitialBoard()
    initialBoard.columns[0].cardIds = ['card-1']
    initialBoard.columns[1].cardIds = ['card-2']

    const { result } = renderHook(() => useKanbanViewModel(initialBoard))

    act(() => {
      result.current.moveCard('col-backlog', 'col-todo', 0, 0)
    })

    expect(result.current.board.columns[0].cardIds).toEqual([])
    expect(result.current.board.columns[1].cardIds).toEqual(['card-1', 'card-2'])
  })

  it('handles invalid column move operations gracefully', () => {
    const { result } = renderHook(() => useKanbanViewModel())
    const originalColumns = result.current.board.columns

    act(() => {
      result.current.moveCard('invalid-src', 'col-todo', 0, 0)
      result.current.moveCard('col-backlog', 'invalid-dest', 0, 0)
      result.current.moveCard('col-backlog', 'col-todo', 999, 0)
    })

    expect(result.current.board.columns).toEqual(originalColumns)
  })

  it('manages modal open and close states', () => {
    const { result } = renderHook(() => useKanbanViewModel())
    expect(result.current.modalState.isOpen).toBe(false)
    expect(result.current.modalState.targetColumnId).toBeNull()

    act(() => {
      result.current.modalState.openModal('col-todo')
    })
    expect(result.current.modalState.isOpen).toBe(true)
    expect(result.current.modalState.targetColumnId).toBe('col-todo')

    act(() => {
      result.current.modalState.closeModal()
    })
    expect(result.current.modalState.isOpen).toBe(false)
    expect(result.current.modalState.targetColumnId).toBeNull()
  })
})
