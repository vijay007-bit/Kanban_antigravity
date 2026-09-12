export interface Card {
  id: string
  title: string
  details: string
  createdAt: number
}

export interface Column {
  id: string
  title: string
  cardIds: string[]
}

export interface Board {
  id: string
  title: string
  columns: Column[]
  cards: Record<string, Card>
}

export const INITIAL_COLUMNS: { id: string; title: string }[] = [
  { id: 'col-backlog', title: 'Backlog' },
  { id: 'col-todo', title: 'To Do' },
  { id: 'col-in-progress', title: 'In Progress' },
  { id: 'col-review', title: 'Review' },
  { id: 'col-done', title: 'Done' },
]

export const createInitialBoard = (): Board => {
  const cards: Record<string, Card> = {
    'card-1': {
      id: 'card-1',
      title: 'Architect System Components',
      details: 'Draft technical specifications for core architecture and data contract boundaries.',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    'card-2': {
      id: 'card-2',
      title: 'Design Responsive Color Tokens',
      details: 'Integrate custom brand palette including dark navy, vibrant yellow, and royal blue accents.',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    'card-3': {
      id: 'card-3',
      title: 'Implement Drag and Drop Handler',
      details: 'Enable smooth card transfers between all 5 columns with fluid reordering physics.',
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    'card-4': {
      id: 'card-4',
      title: 'Build Column Rename Mechanism',
      details: 'Support direct inline title editing with keyboard shortcuts and blur handlers.',
      createdAt: Date.now() - 1000 * 60 * 60 * 12,
    },
    'card-5': {
      id: 'card-5',
      title: 'Verify Accessibility Guidelines',
      details: 'Ensure WCAG compliance, high contrast ratios, and keyboard navigation support.',
      createdAt: Date.now() - 1000 * 60 * 60 * 6,
    },
    'card-6': {
      id: 'card-6',
      title: 'Configure Unit & Integration Tests',
      details: 'Execute comprehensive Vitest suites and Playwright browser integration checks.',
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
  }

  const columns: Column[] = [
    {
      id: 'col-backlog',
      title: 'Backlog',
      cardIds: ['card-1'],
    },
    {
      id: 'col-todo',
      title: 'To Do',
      cardIds: ['card-2'],
    },
    {
      id: 'col-in-progress',
      title: 'In Progress',
      cardIds: ['card-3'],
    },
    {
      id: 'col-review',
      title: 'Review',
      cardIds: ['card-4'],
    },
    {
      id: 'col-done',
      title: 'Done',
      cardIds: ['card-5', 'card-6'],
    },
  ]

  return {
    id: 'main-board',
    title: 'Project Roadmap',
    columns,
    cards,
  }
}
