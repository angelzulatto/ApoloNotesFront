import { useState, useEffect } from 'react';
import { Tag, CreateTagRequest, UpdateTagRequest } from '../types';
import * as tagsService from '../services/tags';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagsService.listTags();
      setTags(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (data: CreateTagRequest) => {
    setError(null);
    try {
      const newTag = await tagsService.createTag(data);
      setTags([...tags, newTag]);
      return newTag;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create tag');
      throw err;
    }
  };

  const updateTag = async (id: number, data: UpdateTagRequest) => {
    setError(null);
    try {
      const updatedTag = await tagsService.updateTag(id, data);
      setTags(tags.map(tag => tag.id === id ? updatedTag : tag));
      return updatedTag;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update tag');
      throw err;
    }
  };

  const deleteTag = async (id: number) => {
    setError(null);
    try {
      await tagsService.deleteTag(id);
      setTags(tags.filter(tag => tag.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete tag');
      throw err;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
  };
};
