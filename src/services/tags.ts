import api from './api';
import { Tag, CreateTagRequest, UpdateTagRequest } from '../types';

export const listTags = async (): Promise<Tag[]> => {
  const response = await api.get<Tag[]>('/tags');
  return response.data;
};

export const createTag = async (data: CreateTagRequest): Promise<Tag> => {
  const response = await api.post<Tag>('/tags', data);
  return response.data;
};

export const updateTag = async (id: number, data: UpdateTagRequest): Promise<Tag> => {
  const response = await api.put<Tag>(`/tags/${id}`, data);
  return response.data;
};

export const deleteTag = async (id: number): Promise<void> => {
  await api.delete(`/tags/${id}`);
};
