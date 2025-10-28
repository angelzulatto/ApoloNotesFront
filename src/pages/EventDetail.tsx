import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useEvents } from "../hooks/useEvents";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import dayjs from "dayjs";
import { Evento } from "../services/events";
import { useTags } from "../hooks/useTags";

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, deleteEvent, loading } = useEvents();
  const { toasts, showToast, removeToast } = useToast();
  const { tags } = useTags();

  const [event, setEvent] = useState<Evento | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await getEvent(Number(id));
      setEvent(data);
    } catch (error) {
      showToast("Failed to load event", "error");
      navigate("/events");
    }
  };

  const handleDelete = async () => {
    try {
      setShowDeleteConfirm(false);
      await deleteEvent(Number(id));
      showToast("Event deleted successfully", "success");
      navigate("/events");
    } catch (error: any) {
      console.error("Error deleting event:", error);
      showToast(
        error?.response?.data?.message || "Failed to delete event",
        "error"
      );
    }
  };

  if (loading || !event) {
    return (
      <Layout>
        <div className="text-center py-8 text-gray-600">Loading event...</div>
      </Layout>
    );
  }

  const isUpcoming = dayjs(event.fechaCreacion).isAfter(dayjs());

  // Resolver tags a partir de event.taglist (ids separados por comas)
  const tagIds = (event.taglist ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .filter((n) => Number.isInteger(n) && n > 0);
  const resolvedTags = tags.filter((t) => tagIds.includes(t.id));

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/events")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex-1">
            Event Details
          </h1>
          <div className="flex gap-2">
            <Link
              to={`/events/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div
          className={`bg-white rounded-lg shadow-md p-6 space-y-6 border-l-4 ${
            isUpcoming ? "border-green-500" : "border-gray-300"
          }`}
        >
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <CalendarIcon
                  className={`w-6 h-6 ${
                    isUpcoming ? "text-green-600" : "text-gray-600"
                  } mt-1`}
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  {event.nombre}
                </h2>
              </div>
              {isUpcoming && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Upcoming
                </span>
              )}
            </div>
          </div>

          {event.contenido && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.contenido}
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Date & Time
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-sm font-medium text-gray-600 w-16">
                  Start:
                </span>
                <span className="text-sm text-gray-900">
                  {dayjs(event.fechaCreacion).format(
                    "dddd, MMMM D, YYYY [at] h:mm A"
                  )}
                </span>
              </div>
              {event.fechaDeEvento && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-600 w-16">
                    End:
                  </span>
                  <span className="text-sm text-gray-900">
                    {dayjs(event.fechaDeEvento).format(
                      "dddd, MMMM D, YYYY [at] h:mm A"
                    )}
                  </span>
                </div>
              )}
              {event.fechaDeEvento && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-600 w-16">
                    Duration:
                  </span>
                  <span className="text-sm text-gray-900">
                    {dayjs(event.fechaDeEvento).diff(
                      dayjs(event.fechaCreacion),
                      "hour"
                    )}{" "}
                    hours
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resolvedTags.length === 0 ? (
                <span className="text-gray-500 text-sm">No tags</span>
              ) : (
                resolvedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag.nombreTag}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
};
