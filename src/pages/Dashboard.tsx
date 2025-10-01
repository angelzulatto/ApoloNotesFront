import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { FileText, Calendar, Tag } from "lucide-react";
import { useNotes } from "../hooks/useNotes";
import { useEvents } from "../hooks/useEvents";
import { useTags } from "../hooks/useTags";
import dayjs from "dayjs";

export const Dashboard = () => {
  const { fetchNotes } = useNotes();
  const { fetchEvents } = useEvents();
  const { tags } = useTags();

  const [stats, setStats] = useState({
    totalNotes: 0,
    upcomingEvents: 0,
    totalTags: tags.length,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const notesData = await fetchNotes();
        const eventsData = await fetchEvents();

        const upcoming = eventsData.filter((event) =>
          dayjs(event.startAt).isAfter(dayjs())
        ).length;

        console.log("Fetched Stats:", {
          totalNotes: notesData.length,
          upcomingEvents: upcoming,
          totalTags: tags.length,
        });
        setStats({
          totalNotes: notesData.length,
          upcomingEvents: upcoming,
          totalTags: tags.length,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, [tags.length]);

  const cards = [
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Total Tags",
      value: stats.totalTags,
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
