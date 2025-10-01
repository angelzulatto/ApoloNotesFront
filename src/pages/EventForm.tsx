import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { TagSelector } from '../components/TagSelector';
import { useEvents } from '../hooks/useEvents';
import { useTags } from '../hooks/useTags';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { Save, ArrowLeft } from 'lucide-react';
import dayjs from 'dayjs';

const schema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string(),
  startAt: yup.string().required('Start date/time is required'),
  endAt: yup.string().test('end-after-start', 'End date/time must be after start date/time', function(value) {
    const { startAt } = this.parent;
    if (!value || !startAt) return true;
    return dayjs(value).isAfter(dayjs(startAt));
  }),
  tagIds: yup.array().of(yup.number().required()).required(),
});

type FormData = {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  tagIds: number[];
};

export const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { getEvent, createEvent, updateEvent, loading } = useEvents();
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
      description: '',
      startAt: '',
      endAt: '',
      tagIds: [],
    },
  });

  const tagIds = watch('tagIds');

  useEffect(() => {
    if (isEdit && id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const event = await getEvent(Number(id));
      setValue('title', event.title);
      setValue('description', event.description || '');
      setValue('startAt', dayjs(event.startAt).format('YYYY-MM-DDTHH:mm'));
      if (event.endAt) {
        setValue('endAt', dayjs(event.endAt).format('YYYY-MM-DDTHH:mm'));
      }
      setValue('tagIds', event.tags.map(tag => tag.id));
    } catch (error) {
      showToast('Failed to load event', 'error');
      navigate('/events');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        startAt: dayjs(data.startAt).toISOString(),
        endAt: data.endAt ? dayjs(data.endAt).toISOString() : undefined,
      };

      if (isEdit && id) {
        await updateEvent(Number(id), payload);
        showToast('Event updated successfully', 'success');
      } else {
        await createEvent(payload);
        showToast('Event created successfully', 'success');
      }
      navigate('/events');
    } catch (error) {
      showToast(isEdit ? 'Failed to update event' : 'Failed to create event', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/events')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? 'Edit Event' : 'Create Event'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update your event details' : 'Fill in the details to create a new event'}
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
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Enter event description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startAt" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date/Time <span className="text-red-600">*</span>
              </label>
              <input
                {...register('startAt')}
                type="datetime-local"
                id="startAt"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.startAt && (
                <p className="text-red-600 text-sm mt-1">{errors.startAt.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endAt" className="block text-sm font-medium text-gray-700 mb-2">
                End Date/Time
              </label>
              <input
                {...register('endAt')}
                type="datetime-local"
                id="endAt"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.endAt && (
                <p className="text-red-600 text-sm mt-1">{errors.endAt.message}</p>
              )}
            </div>
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

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
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
