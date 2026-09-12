import React, { useState, useRef, useEffect } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import type { Column, Card } from '../models/types'
import { CardView } from './CardView'

interface ColumnViewProps {
  column: Column
  cards: Record<string, Card>
  onRename: (columnId: string, newTitle: string) => boolean
  onDeleteCard: (cardId: string, columnId: string) => void
  onOpenAddModal: (columnId: string) => void
}

export const ColumnView: React.FC<ColumnViewProps> = ({
  column,
  cards,
  onRename,
  onDeleteCard,
  onOpenAddModal,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitleValue, setEditTitleValue] = useState(column.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  const handleStartEdit = () => {
    setEditTitleValue(column.title)
    setIsEditingTitle(true)
  }

  const handleSaveTitle = () => {
    const success = onRename(column.id, editTitleValue)
    if (!success) {
      setEditTitleValue(column.title)
    }
    setIsEditingTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      setEditTitleValue(column.title)
      setIsEditingTitle(false)
    }
  }

  const columnCards = column.cardIds
    .map((cardId) => cards[cardId])
    .filter((card): card is Card => Boolean(card))

  return (
    <section className="column-card" data-testid={`column-${column.id}`}>
      <div className="column-top-indicator" />
      <div className="column-header">
        <div className="column-title-group">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              className="column-title-input"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              aria-label="Rename column"
              data-testid={`column-title-input-${column.id}`}
            />
          ) : (
            <h2
              className="column-title-text"
              onClick={handleStartEdit}
              title="Click to rename column"
              data-testid={`column-title-${column.id}`}
            >
              {column.title}
            </h2>
          )}
          <span className="column-count-badge" data-testid={`column-count-${column.id}`}>
            {column.cardIds.length}
          </span>
        </div>

        <button
          type="button"
          className="btn-add-card-header"
          onClick={() => onOpenAddModal(column.id)}
          aria-label={`Add card to ${column.title}`}
          title="Add card"
          data-testid={`btn-add-card-header-${column.id}`}
        >
          <Plus size={16} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`card-list-droppable ${
              snapshot.isDraggingOver ? 'is-dragging-over' : ''
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
            data-testid={`droppable-${column.id}`}
          >
            {columnCards.length === 0 && !snapshot.isDraggingOver && (
              <div className="empty-column-placeholder">No cards in this column</div>
            )}

            {columnCards.map((card, index) => (
              <CardView
                key={card.id}
                card={card}
                index={index}
                columnId={column.id}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="column-footer">
        <button
          type="button"
          className="btn-add-card-column"
          onClick={() => onOpenAddModal(column.id)}
          data-testid={`btn-add-card-bottom-${column.id}`}
        >
          <Plus size={15} />
          <span>Add Card</span>
        </button>
      </div>
    </section>
  )
}
