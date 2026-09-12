import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { CardView } from '../CardView'
import type { Card } from '../../models/types'

const mockCard: Card = {
  id: 'card-101',
  title: 'Test Draggable Card',
  details: 'Card details description',
  createdAt: 1700000000000,
}

const renderWithDnd = (ui: React.ReactNode) => {
  return render(
    <DragDropContext onDragEnd={vi.fn()}>
      <Droppable droppableId="col-test">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {ui}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

describe('CardView Component', () => {
  it('renders card title, details and formatted date', () => {
    renderWithDnd(
      <CardView
        card={mockCard}
        index={0}
        columnId="col-test"
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Test Draggable Card')).toBeInTheDocument()
    expect(screen.getByText('Card details description')).toBeInTheDocument()
    expect(screen.getByTestId('card-card-101')).toBeInTheDocument()
  })

  it('renders card without details when details is empty', () => {
    const cardNoDetails: Card = {
      id: 'card-102',
      title: 'No details title',
      details: '',
      createdAt: 1700000000000,
    }

    renderWithDnd(
      <CardView
        card={cardNoDetails}
        index={0}
        columnId="col-test"
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('No details title')).toBeInTheDocument()
    expect(screen.queryByText('Card details description')).not.toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    renderWithDnd(
      <CardView
        card={mockCard}
        index={0}
        columnId="col-test"
        onDelete={onDelete}
      />
    )

    const deleteBtn = screen.getByTestId('delete-card-card-101')
    fireEvent.click(deleteBtn)

    expect(onDelete).toHaveBeenCalledWith('card-101', 'col-test')
  })
})
