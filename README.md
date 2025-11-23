# Project Overview

## Sections

The application is divided into the following sections:

### Public Routes
- **Login** (`/login`): User authentication page.
- **Signup** (`/signup`): User registration page.

### Private Routes (Protected)
- **Dashboard** (`/` or `/dashboard`): Main overview page.
- **Tags** (`/tags`): Management of tags.
- **Notes**:
    - **List** (`/notes`): View all notes.
    - **Create** (`/notes/new`): Create a new note.
    - **Detail** (`/notes/:id`): View a specific note.
    - **Edit** (`/notes/:id/edit`): Edit an existing note.
- **Events**:
    - **List** (`/events`): View all events.
    - **Create** (`/events/new`): Create a new event.
    - **Detail** (`/events/:id`): View a specific event.
    - **Edit** (`/events/:id/edit`): Edit an existing event.

## Design System

The project uses **Tailwind CSS** with its default configuration.

### Typography

The project relies on Tailwind's default sans-serif font stack (Inter, system-ui, etc.).

**Headings:**
- **H1:** `text-3xl font-bold` (e.g., Page titles)
- **H2:** `text-2xl font-bold` (e.g., Section titles, Card titles)
- **H3:** `text-xl font-semibold` or `text-lg font-semibold` (e.g., Subsections)

**Body:**
- **Default:** `text-base`
- **Small:** `text-sm` (e.g., Labels, Secondary text)
- **Extra Small:** `text-xs` (e.g., Badges, Metadata)

### Colors

The project uses the standard Tailwind CSS color palette.

**Primary Color (Blue):**
Used for primary actions, buttons, links, and active states.
- `bg-blue-600` (Primary Button Background)
- `hover:bg-blue-700` (Primary Button Hover)
- `text-blue-600` (Links, Accents)
- `bg-blue-100` / `text-blue-800` (Badges, Light backgrounds)

**Neutral Colors (Gray):**
Used for text, backgrounds, and borders.
- `text-gray-900` (Headings, Primary Text)
- `text-gray-800` (Secondary Headings)
- `text-gray-700` (Body Text, Labels)
- `text-gray-600` (Secondary Text)
- `text-gray-500` / `text-gray-400` (Placeholders, Icons)
- `border-gray-300` / `border-gray-200` (Borders)
- `bg-gray-200` (Secondary Buttons, Inputs)
- `bg-gray-100` (Page Backgrounds, Cards)
- `bg-gray-50` (Subtle Backgrounds)
- `bg-white` (Card Backgrounds, Input Backgrounds)

**Semantic Colors:**
- **Danger (Red):** `text-red-600`, `bg-red-600` (Error messages, Delete actions)
- **Success (Green):** `text-green-700`, `bg-green-100` (Success states, Badges)
