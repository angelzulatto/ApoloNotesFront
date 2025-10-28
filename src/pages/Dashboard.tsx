import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { FileText, Calendar, Tag } from "lucide-react";
import dayjs from "dayjs";
import { listNotes } from "../services/notes";
import { listEvents } from "../services/events";
import { listTags } from "../services/tags";

export const Dashboard = () => {
  const [totalTags, setTotalTags] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    console.log("loadStats");
    const loadStats = async () => {
      console.log("loading stats");
      try {
        const notesData = await listNotes();
        setTotalNotes(notesData.filter((note) => note.recursoActivo).length);
        const eventsData = await listEvents();
        setTotalEvents(
          eventsData.filter((event) => event.recursoActivo).length
        );
        const tagsData = await listTags();
        setTotalTags(tagsData.length);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      title: "Total Notes",
      value: totalNotes,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Upcoming Events",
      value: totalEvents,
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Total Tags",
      value: totalTags,
      icon: Tag,
      color: "bg-amber-500",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your notes, events, and tags
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/notes/new"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Create Note</span>
            </a>
            <a
              href="/events/new"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Create Event</span>
            </a>
            <a
              href="/tags"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Tag className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-gray-900">Manage Tags</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
