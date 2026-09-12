# Kanban Web Application

A minimalist, client-rendered Kanban project management board web application built with React, TypeScript, Vite, and modern CSS following MVVM architecture.

## Features

- Single board workspace initialized with sample tasks.
- 5 fixed columns with inline renaming capability.
- Drag-and-drop card movement across columns and reordering within columns.
- Add new tasks with title and details via accessible modal dialog.
- Delete existing tasks.
- Responsive layout adhering to custom design tokens.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
cd frontend
npm install
```

### Development Server

Start the local development server:

```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Running Tests

Run Vitest unit tests:

```bash
cd frontend
npm run test:unit
```

Run Playwright end-to-end integration tests:

```bash
cd frontend
npm run test:e2e
```

### Production Build

```bash
cd frontend
npm run build
```
