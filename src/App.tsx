import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Tags } from "./pages/Tags";
import { NotesList } from "./pages/NotesList";
import { NoteForm } from "./pages/NoteForm";
import { NoteDetail } from "./pages/NoteDetail";
import { EventsList } from "./pages/EventsList";
import { EventForm } from "./pages/EventForm";
import { EventDetail } from "./pages/EventDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/tags"
          element={
            <RequireAuth>
              <Tags />
            </RequireAuth>
          }
        />

        <Route
          path="/notes"
          element={
            <RequireAuth>
              <NotesList />
            </RequireAuth>
          }
        />

        <Route
          path="/notes/new"
          element={
            <RequireAuth>
              <NoteForm />
            </RequireAuth>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <RequireAuth>
              <NoteDetail />
            </RequireAuth>
          }
        />

        <Route
          path="/notes/:id/edit"
          element={
            <RequireAuth>
              <NoteForm />
            </RequireAuth>
          }
        />

        <Route
          path="/events/new"
          element={
            <RequireAuth>
              <EventForm />
            </RequireAuth>
          }
        />

        <Route
          path="/events/:id/edit"
          element={
            <RequireAuth>
              <EventForm />
            </RequireAuth>
          }
        />

        <Route
          path="/events/:id"
          element={
            <RequireAuth>
              <EventDetail />
            </RequireAuth>
          }
        />

        <Route
          path="/events"
          element={
            <RequireAuth>
              <EventsList />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
