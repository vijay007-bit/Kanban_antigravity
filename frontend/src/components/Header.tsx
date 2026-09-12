import React from 'react'
import { Kanban } from 'lucide-react'

interface HeaderProps {
  boardTitle: string
  totalCards: number
  columnCount: number
}

export const Header: React.FC<HeaderProps> = ({ boardTitle, totalCards, columnCount }) => {
  return (
    <header className="app-header">
      <div className="header-accent-bar" />
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-badge" aria-hidden="true">
            <Kanban size={22} />
          </div>
          <div className="brand-titles">
            <h1 className="brand-title">Kanban Flow</h1>
            <span className="brand-subtitle">{boardTitle}</span>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-dot" />
            <span>{columnCount} Columns</span>
          </div>
          <div className="stat-pill">
            <span>{totalCards} Total Tasks</span>
          </div>
        </div>
      </div>
    </header>
  )
}
