import { useState, useCallback } from 'react'
import { createInitialBoard, type Board, type Card } from '../models/types'

export interface KanbanViewModel {
  board: Board
  addCard: (columnId: string, title: string, details: string) => boolean
  deleteCard: (cardId: string, columnId: string) => void
  renameColumn: (columnId: string, newTitle: string) => boolean
  moveCard: (
    sourceColumnId: string,
    destColumnId: string,
    sourceIndex: number,
    destIndex: number
  ) => void
  modalState: {
    isOpen: boolean
    targetColumnId: string | null
    openModal: (columnId: string) => void
    closeModal: () => void
  }
}

export function useKanbanViewModel(initialBoard: Board = createInitialBoard()): KanbanViewModel {
  const [board, setBoard] = useState<Board>(initialBoard)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    targetColumnId: string | null
  }>({
    isOpen: false,
    targetColumnId: null,
  })

  const openModal = useCallback((columnId: string) => {
    setModalState({ isOpen: true, targetColumnId: columnId })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, targetColumnId: null })
  }, [])

  const addCard = useCallback(
    (columnId: string, title: string, details: string): boolean => {
      const trimmedTitle = title.trim()
      const trimmedDetails = details.trim()

      if (!trimmedTitle) {
        return false
      }

      const newCardId = `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const newCard: Card = {
        id: newCardId,
        title: trimmedTitle,
        details: trimmedDetails,
        createdAt: Date.now(),
      }

      setBoard((prevBoard) => {
        const columnExists = prevBoard.columns.some((col) => col.id === columnId)
        if (!columnExists) return prevBoard

        const updatedColumns = prevBoard.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cardIds: [...col.cardIds, newCardId],
            }
          }
          return col
        })

        return {
          ...prevBoard,
          cards: {
            ...prevBoard.cards,
            [newCardId]: newCard,
          },
          columns: updatedColumns,
        }
      })

      return true
    },
    []
  )

  const deleteCard = useCallback((cardId: string, columnId: string) => {
    setBoard((prevBoard) => {
      const { [cardId]: _, ...remainingCards } = prevBoard.cards

      const updatedColumns = prevBoard.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cardIds: col.cardIds.filter((id) => id !== cardId),
          }
        }
        return col
      })

      return {
        ...prevBoard,
        cards: remainingCards,
        columns: updatedColumns,
      }
    })
  }, [])

  const renameColumn = useCallback((columnId: string, newTitle: string): boolean => {
    const trimmed = newTitle.trim()
    if (!trimmed) {
      return false
    }

    setBoard((prevBoard) => {
      const updatedColumns = prevBoard.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            title: trimmed,
          }
        }
        return col
      })

      return {
        ...prevBoard,
        columns: updatedColumns,
      }
    })

    return true
  }, [])

  const moveCard = useCallback(
    (
      sourceColumnId: string,
      destColumnId: string,
      sourceIndex: number,
      destIndex: number
    ) => {
      setBoard((prevBoard) => {
        const sourceCol = prevBoard.columns.find((c) => c.id === sourceColumnId)
        const destCol = prevBoard.columns.find((c) => c.id === destColumnId)

        if (!sourceCol || !destCol) return prevBoard

        const sourceCardIds = Array.from(sourceCol.cardIds)
        const [movedCardId] = sourceCardIds.splice(sourceIndex, 1)

        if (!movedCardId) return prevBoard

        if (sourceColumnId === destColumnId) {
          sourceCardIds.splice(destIndex, 0, movedCardId)
          const updatedColumns = prevBoard.columns.map((col) => {
            if (col.id === sourceColumnId) {
              return { ...col, cardIds: sourceCardIds }
            }
            return col
          })

          return { ...prevBoard, columns: updatedColumns }
        }

        const destCardIds = Array.from(destCol.cardIds)
        destCardIds.splice(destIndex, 0, movedCardId)

        const updatedColumns = prevBoard.columns.map((col) => {
          if (col.id === sourceColumnId) {
            return { ...col, cardIds: sourceCardIds }
          }
          if (col.id === destColumnId) {
            return { ...col, cardIds: destCardIds }
          }
          return col
        })

        return { ...prevBoard, columns: updatedColumns }
      })
    },
    []
  )

  return {
    board,
    addCard,
    deleteCard,
    renameColumn,
    moveCard,
    modalState: {
      isOpen: modalState.isOpen,
      targetColumnId: modalState.targetColumnId,
      openModal,
      closeModal,
    },
  }
}
