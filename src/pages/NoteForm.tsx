import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { TagSelector } from '../components/TagSelector';
import { useNotes } from '../hooks/useNotes';
import { useTags } from '../hooks/useTags';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { Save, ArrowLeft } from 'lucide-react';

const schema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  content: yup.string().max(5000, 'Content must be less than 5000 characters'),
  tagIds: yup.array().of(yup.number().required()).required(),
  archived: yup.boolean(),
});

type FormData = {
  title: string;
  content: string;
  tagIds: number[];
  archived: boolean;
};

export const NoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { getNote, createNote, updateNote, loading } = useNotes();
  const { tags } = useTags();
  const { toasts, showToast, removeToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      tagIds: [],
      archived: false,
    },
  });

  const tagIds = watch('tagIds');

  useEffect(() => {
    if (isEdit && id) {
      loadNote();
    }
  }, [id]);

  const loadNote = async () => {
    try {
      const note = await getNote(Number(id));
      setValue('title', note.title);
      setValue('content', note.content);
      setValue('tagIds', note.tags.map(tag => tag.id));
      setValue('archived', note.archived);
    } catch (error) {
      showToast('Failed to load note', 'error');
      navigate('/notes');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && id) {
        await updateNote(Number(id), data);
        showToast('Note updated successfully', 'success');
      } else {
        await createNote(data);
        showToast('Note created successfully', 'success');
      }
      navigate('/notes');
    } catch (error) {
      showToast(isEdit ? 'Failed to update note' : 'Failed to create note', 'error');
    }
  };

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? 'Edit Note' : 'Create Note'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update your note details' : 'Fill in the details to create a new note'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter note title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              {...register('content')}
              id="content"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Enter note content"
            />
            {errors.content && (
              <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <TagSelector
              tags={tags}
              selectedTagIds={tagIds}
              onChange={(ids) => setValue('tagIds', ids)}
              error={errors.tagIds?.message}
            />
          </div>

          {isEdit && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('archived')}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Archive this note</span>
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : (isEdit ? 'Update Note' : 'Create Note')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/notes')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
};
