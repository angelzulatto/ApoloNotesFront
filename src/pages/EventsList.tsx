import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useEvents } from "../hooks/useEvents";
import { Plus, Eye, Calendar as CalendarIcon, Archive } from "lucide-react";
import dayjs from "dayjs";

export const EventsList = () => {
  const { events, loading, fetchEvents } = useEvents();
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  const upcomingEvents = events.filter(
    (event) =>
      dayjs(event.fechaDeEvento).isAfter(dayjs()) &&
      (showArchived ? !event.recursoActivo : event.recursoActivo)
  );
  const pastEvents = events.filter(
    (event) =>
      dayjs(event.fechaDeEvento).isBefore(dayjs()) &&
      (showArchived ? !event.recursoActivo : event.recursoActivo)
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Manage your events</p>
          </div>
          <Link
            to="/events/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Event
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-end">
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <Archive className="w-5 h-5 text-gray-600" />
              <span>Show Archived</span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            No events found. Create your first event!
          </div>
        ) : (
          <>
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <CalendarIcon className="w-5 h-5 text-green-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {event.nombre}
                              {!event.recursoActivo && (
                                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                  Archived
                                </span>
                              )}
                            </h3>
                            {event.contenido && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {event.contenido}
                              </p>
                            )}
                          </div>
                        </div>
                        <Eye className="w-5 h-5 text-gray-400" />
                      </div>

                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Start:</span>{" "}
                          {dayjs(event.fechaCreacion).format(
                            "MMM D, YYYY [at] h:mm A"
                          )}
                        </p>
                        {event.fechaDeEvento && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">End:</span>{" "}
                            {dayjs(event.fechaDeEvento).format(
                              "MMM D, YYYY [at] h:mm A"
                            )}
                          </p>
                        )}
                      </div>

                      {/* {event.tagList.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.tagList.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {tag.nombreTag}
                            </span>
                          ))}
                        </div>
                      )} */}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Past Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-gray-300 opacity-75"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <CalendarIcon className="w-5 h-5 text-gray-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {event.nombre}
                              {!event.recursoActivo && (
                                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                  Archived
                                </span>
                              )}
                            </h3>
                            {event.contenido && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {event.contenido}
                              </p>
                            )}
                          </div>
                        </div>
                        <Eye className="w-5 h-5 text-gray-400" />
                      </div>

                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Start:</span>{" "}
                          {dayjs(event.fechaCreacion).format(
                            "MMM D, YYYY [at] h:mm A"
                          )}
                        </p>
                        {event.fechaDeEvento && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">End:</span>{" "}
                            {dayjs(event.fechaDeEvento).format(
                              "MMM D, YYYY [at] h:mm A"
                            )}
                          </p>
                        )}
                      </div>

                      {/* {event.tagList.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.tagList.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {tag.nombreTag}
                            </span>
                          ))}
                        </div>
                      )} */}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
