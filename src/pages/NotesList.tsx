import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useNotes } from '../hooks/useNotes';
import { useTags } from '../hooks/useTags';
import { Plus, Eye, Archive, Search } from 'lucide-react';
import dayjs from 'dayjs';

export const NotesList = () => {
  const { notes, loading, fetchNotes } = useNotes();
  const { tags } = useTags();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [page, showArchived, selectedTag]);

  const loadNotes = () => {
    const params: any = { page, size: 10 };
    if (showArchived) params.archived = true;
    if (selectedTag) params.tag = selectedTag;
    fetchNotes(params);
  };

  const filteredNotes = notes?.content.filter(note =>
    search === '' ||
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notes</h1>
            <p className="text-gray-600">Manage your notes</p>
          </div>
          <Link
            to="/notes/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Note
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </select>

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
            Loading notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            No notes found. Create your first note!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {note.title}
                      {note.archived && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          Archived
                        </span>
                      )}
                    </h3>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {note.content}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500">
                    Updated {dayjs(note.updatedAt).format('MMM D, YYYY')}
                  </p>
                </Link>
              ))}
            </div>

            {notes && notes.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page + 1} of {notes.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(notes.totalPages - 1, page + 1))}
                  disabled={page >= notes.totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
