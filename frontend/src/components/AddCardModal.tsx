import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface AddCardModalProps {
  isOpen: boolean
  columnId: string | null
  columnTitle?: string
  onClose: () => void
  onSubmit: (columnId: string, title: string, details: string) => boolean
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  columnId,
  columnTitle,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setDetails('')
      setError('')
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !columnId) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Card title is required')
      titleInputRef.current?.focus()
      return
    }

    const success = onSubmit(columnId, title, details)
    if (success) {
      onClose()
    } else {
      setError('Failed to create card. Please check input.')
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      data-testid="modal-overlay"
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-heading"
        onClick={(e) => e.stopPropagation()}
        data-testid="add-card-modal"
      >
        <div className="modal-header">
          <div className="modal-header-indicator" />
          <h2 id="modal-title-heading" className="modal-title">
            Add New Card {columnTitle ? `to ${columnTitle}` : ''}
          </h2>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Close dialog"
            data-testid="btn-close-modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="card-title-input" className="form-label">
                Card Title *
              </label>
              <input
                id="card-title-input"
                ref={titleInputRef}
                type="text"
                className="form-input"
                placeholder="Enter task summary or feature name..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError('')
                }}
                data-testid="input-card-title"
                autoComplete="off"
              />
              {error && <span className="form-error" role="alert">{error}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="card-details-input" className="form-label">
                Card Details <span className="form-label-optional">(Optional)</span>
              </label>
              <textarea
                id="card-details-input"
                className="form-textarea"
                placeholder="Add supporting context, acceptance criteria, or notes..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                data-testid="input-card-details"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              data-testid="btn-cancel-modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              data-testid="btn-submit-card"
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
