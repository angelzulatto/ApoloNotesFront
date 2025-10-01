import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useNotes } from '../hooks/useNotes';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { ArrowLeft, Pencil, Trash2, Archive } from 'lucide-react';
import { Note } from '../types';
import dayjs from 'dayjs';

export const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, deleteNote, loading } = useNotes();
  const { toasts, showToast, removeToast } = useToast();

  const [note, setNote] = useState<Note | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      const data = await getNote(Number(id));
      setNote(data);
    } catch (error) {
      showToast('Failed to load note', 'error');
      navigate('/notes');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(Number(id));
      showToast('Note deleted successfully', 'success');
      navigate('/notes');
    } catch (error) {
      showToast('Failed to delete note', 'error');
    }
  };

  if (loading || !note) {
    return (
      <Layout>
        <div className="text-center py-8 text-gray-600">Loading note...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/notes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex-1">Note Details</h1>
          <div className="flex gap-2">
            <Link
              to={`/notes/${id}/edit`}
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

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{note.title}</h2>
              {note.archived && (
                <span className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  <Archive className="w-4 h-4" />
                  Archived
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Created {dayjs(note.createdAt).format('MMM D, YYYY [at] h:mm A')}
              {note.createdAt !== note.updatedAt && (
                <> • Updated {dayjs(note.updatedAt).format('MMM D, YYYY [at] h:mm A')}</>
              )}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {note.tags.length === 0 ? (
                <span className="text-gray-500 text-sm">No tags</span>
              ) : (
                note.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Content</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{note.content || 'No content'}</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
};
