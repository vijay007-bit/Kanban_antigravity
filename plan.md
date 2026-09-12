# Kanban Web Application MVP - Implementation Plan

An MVP Kanban project management web application built in the `frontend` subdirectory using a modern client-rendered NodeJS stack (Vite + React + TypeScript + Vanilla CSS), following strict MVVM architecture, clean SOLID design, and the exact specified color palette.

## Technical & Business Requirements

- Single board workspace with fixed 5 columns that can be renamed.
- Each card has a title and details only.
- Drag-and-drop interface to move cards between columns and reorder within columns.
- Add a new card to a column; delete an existing card.
- Opens with initial dummy data populated.
- Client-rendered NodeJS application located in `frontend/`.
- Color scheme:
  - Accent Yellow: `#ecad0a`
  - Blue Primary: `#209dd7`
  - Purple Secondary: `#753991`
  - Dark Navy: `#032147`
  - Gray Text: `#888888`
- Strict constraint: Zero emojis across code, UI, labels, tests, and documentation.

---

## Phased Roadmap and Success Criteria

### Phase 1: Project Scaffolding and Configuration
- [x] Create root and frontend `.gitignore` files.
- [x] Scaffold `frontend` directory using Vite + React + TypeScript.
- [x] Configure runtime dependencies (`@hello-pangea/dnd`, `lucide-react`).
- [x] Configure Vitest unit testing, `@vitest/coverage-v8`, and Playwright integration testing environments.
- **Success Criteria**: Project builds cleanly, test runners initialize without error.

### Phase 2: Domain Models and ViewModel Architecture (MVVM)
- [x] Define immutable domain models: `Card`, `Column`, `Board` in `frontend/src/models/types.ts`.
- [x] Implement initial dummy dataset representing 5 default columns and sample cards.
- [x] Implement `useKanbanViewModel` in `frontend/src/viewmodels/useKanbanViewModel.ts`:
  - Add card to specific column with validation.
  - Delete card by ID.
  - Move card between columns and reorder within column.
  - Rename column title.
  - Manage modal dialog state.
- [x] Write comprehensive unit tests in `frontend/src/viewmodels/__tests__/useKanbanViewModel.test.ts`.
- **Success Criteria**: 100% of domain and ViewModel unit tests pass in Vitest.

### Phase 3: Visual Design System and Component Hierarchy
- [x] Implement CSS design tokens and layout rules in `frontend/src/index.css` adhering strictly to specified color palette.
- [x] Build presentation components:
  - `Header.tsx`: Board title, accent bar, statistics badges.
  - `BoardView.tsx`: Responsive container for the 5 columns with drag-and-drop context.
  - `ColumnView.tsx`: Editable column header, card count badge, droppable card container, add card trigger.
  - `CardView.tsx`: Draggable card displaying title, details, and delete action.
  - `AddCardModal.tsx`: Accessible dialog with validation and purple submit action.
- [x] Enforce zero emojis across all components and typography.
- **Success Criteria**: Responsive visual hierarchy matching color palette and design requirements.

### Phase 4: Drag and Drop Interactions and Layout Fixes
- [x] Integrate drag-and-drop mechanics using `@hello-pangea/dnd`.
- [x] Fix draggable CSS styles to eliminate transform conflicts and layout overflow during drag operations.
- [x] Implement inline column renaming with keyboard Enter/Escape and blur handlers.
- [x] Implement card creation workflow with form validation and keyboard support.
- [x] Implement card deletion.
- **Success Criteria**: Seamless drag-and-drop between all 5 columns with immediate state updates and zero container overflow.

### Phase 5: Unit and Playwright Integration Testing & High Code Coverage
- [x] Run Vitest unit test suite (33 passing tests across 7 test suites).
- [x] Verified Code Coverage exceeding the 80% threshold across all files:
  - **Statements**: 98.84%
  - **Branches**: 91.89%
  - **Functions**: 98.11%
  - **Lines**: 99.39%
- [x] Run Playwright E2E integration test suite across Chromium (8 passing tests).
- [x] Verify drag and drop layout bounds, column rename, card addition/deletion, and zero-emoji compliance.
- **Success Criteria**: All unit and Playwright integration tests pass without failures or flakiness.

### Phase 6: Server Readiness and Documentation
- [x] Verify production build (`npm run build`).
- [x] Start development server on port 5173.
- [x] Create minimal, concise `README.md`.
- **Success Criteria**: Dev server is active and accessible at `http://localhost:5173/`.
