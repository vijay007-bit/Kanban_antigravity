import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Trash2 } from 'lucide-react'
import type { Card } from '../models/types'

interface CardViewProps {
  card: Card
  index: number
  columnId: string
  onDelete: (cardId: string, columnId: string) => void
}

export const CardView: React.FC<CardViewProps> = ({ card, index, columnId, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(card.id, columnId)
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <article
          className={`kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          data-testid={`card-${card.id}`}
        >
          <div className="card-header-row">
            <h3 className="card-title">{card.title}</h3>
            <button
              type="button"
              className="btn-delete-card"
              onClick={handleDelete}
              aria-label={`Delete task: ${card.title}`}
              title="Delete task"
              data-testid={`delete-card-${card.id}`}
            >
              <Trash2 size={14} />
            </button>
          </div>

          {card.details && (
            <p className="card-details">{card.details}</p>
          )}

          <div className="card-footer">
            <div className="card-accent-tag" />
            <span className="card-date">
              {new Date(card.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </article>
      )}
    </Draggable>
  )
}
