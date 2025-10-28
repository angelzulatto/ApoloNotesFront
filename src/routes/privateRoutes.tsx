import { RouteObject } from "react-router";
import { Dashboard } from "../pages/Dashboard";
import { Tags } from "../pages/Tags";
import { NotesList } from "../pages/NotesList";
import { NoteForm } from "../pages/NoteForm";
import { NoteDetail } from "../pages/NoteDetail";
import { EventsList } from "../pages/EventsList";
import { EventForm } from "../pages/EventForm";
import { EventDetail } from "../pages/EventDetail";

export default function PrivateRoutes(): RouteObject[] {
  return [
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/tags",
      element: <Tags />,
    },
    {
      path: "/notes",
      element: <NotesList />,
    },
    {
      path: "/notes/new",
      element: <NoteForm />,
    },
    {
      path: "/notes/:id",
      element: <NoteDetail />,
    },
    {
      path: "/notes/:id/edit",
      element: <NoteForm />,
    },
    {
      path: "/events",
      element: <EventsList />,
    },
    {
      path: "/events/new",
      element: <EventForm />,
    },
    {
      path: "/events/:id",
      element: <EventDetail />,
    },
    {
      path: "/events/:id/edit",
      element: <EventForm />,
    },
  ];
}
