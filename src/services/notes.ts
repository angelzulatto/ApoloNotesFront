import api from "./api";
import {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  ListNotesParams,
  PaginatedResponse,
} from "../types";

export const listNotes = async (
  params?: ListNotesParams
): Promise<PaginatedResponse<Note>> => {
  const response = await api.get<PaginatedResponse<Note>>("/notas", { params });
  return response.data;
};

export const getNote = async (id: number): Promise<Note> => {
  const response = await api.get<Note>(`/notas/${id}`);
  return response.data;
};

export const createNote = async (data: CreateNoteRequest): Promise<Note> => {
  const response = await api.post<Note>("/notas", data);
  return response.data;
};

export const updateNote = async (
  id: number,
  data: UpdateNoteRequest
): Promise<Note> => {
  const response = await api.put<Note>(`/notas/${id}`, data);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notas/${id}`);
};
