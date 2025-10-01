import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Layout } from '../components/Layout';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useTags } from '../hooks/useTags';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { CreateTagRequest } from '../types';

const schema = yup.object({
  name: yup.string().required('Tag name is required').min(1, 'Tag name cannot be empty'),
});

export const Tags = () => {
  const { tags, loading, createTag, updateTag, deleteTag } = useTags();
  const { toasts, showToast, removeToast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTagRequest>({
    resolver: yupResolver(schema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    formState: { errors: editErrors },
  } = useForm<CreateTagRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CreateTagRequest) => {
    try {
      await createTag(data);
      reset();
      showToast('Tag created successfully', 'success');
    } catch (error) {
      showToast('Failed to create tag', 'error');
    }
  };

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setValue('name', name);
  };

  const onEdit = async (data: CreateTagRequest) => {
    if (editingId === null) return;
    try {
      await updateTag(editingId, data);
      setEditingId(null);
      showToast('Tag updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update tag', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTag(id);
      setDeleteConfirm(null);
      showToast('Tag deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete tag', 'error');
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
          <p className="text-gray-600">Manage your tags for organizing notes and events</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Tag</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <div className="flex-1">
              <input
                {...register('name')}
                type="text"
                placeholder="Tag name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Tag
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading && tags.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Loading tags...</div>
          ) : tags.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No tags yet. Create your first tag above.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tags.map((tag) => (
                <div key={tag.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  {editingId === tag.id ? (
                    <form onSubmit={handleSubmitEdit(onEdit)} className="flex-1 flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          {...registerEdit('name')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        {editErrors.name && (
                          <p className="text-red-600 text-sm mt-1">{editErrors.name.message}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </form>
                  ) : (
                    <>
                      <div>
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {tag.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(tag.id, tag.name)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(tag.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Tag"
        message="Are you sure you want to delete this tag? This action cannot be undone."
        onConfirm={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
};
