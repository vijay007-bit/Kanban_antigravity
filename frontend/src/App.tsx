import { useKanbanViewModel } from './viewmodels/useKanbanViewModel'
import { Header } from './components/Header'
import { BoardView } from './components/BoardView'
import { AddCardModal } from './components/AddCardModal'

export function App() {
  const viewModel = useKanbanViewModel()
  const { board, modalState, addCard } = viewModel

  const totalCards = Object.keys(board.cards).length
  const activeColumn = board.columns.find(
    (col) => col.id === modalState.targetColumnId
  )

  return (
    <div className="app-container">
      <Header
        boardTitle={board.title}
        totalCards={totalCards}
        columnCount={board.columns.length}
      />
      
      <BoardView viewModel={viewModel} />

      <AddCardModal
        isOpen={modalState.isOpen}
        columnId={modalState.targetColumnId}
        columnTitle={activeColumn?.title}
        onClose={modalState.closeModal}
        onSubmit={addCard}
      />
    </div>
  )
}

export default App
