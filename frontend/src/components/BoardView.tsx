import React from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { KanbanViewModel } from '../viewmodels/useKanbanViewModel'
import { ColumnView } from './ColumnView'

interface BoardViewProps {
  viewModel: KanbanViewModel
}

export const processDragEnd = (
  result: DropResult,
  moveCard: (
    sourceColumnId: string,
    destColumnId: string,
    sourceIndex: number,
    destIndex: number
  ) => void
) => {
  const { destination, source } = result

  if (!destination) {
    return
  }

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return
  }

  moveCard(
    source.droppableId,
    destination.droppableId,
    source.index,
    destination.index
  )
}

export const BoardView: React.FC<BoardViewProps> = ({ viewModel }) => {
  const { board, renameColumn, deleteCard, moveCard, modalState } = viewModel

  const handleDragEnd = (result: DropResult) => {
    processDragEnd(result, moveCard)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="main-viewport" role="main">
        <div className="board-container" data-testid="kanban-board-container">
          {board.columns.map((column) => (
            <ColumnView
              key={column.id}
              column={column}
              cards={board.cards}
              onRename={renameColumn}
              onDeleteCard={deleteCard}
              onOpenAddModal={modalState.openModal}
            />
          ))}
        </div>
      </main>
    </DragDropContext>
  )
}
