import api from "./api";
import { ListNotesParams, PaginatedResponse } from "../types";

export interface Nota {
  id: number;
  nombre: string;
  fechaCreacion: string;
  recursoActivo: boolean;
  contenido: string | null;
}

export interface CreateNotaRequest {
  nombre: string;
  recursoActivo: boolean;
  contenido: string | null;
  fechaCreacion?: string;
}

export interface UpdateNotaRequest {
  nombre?: string;
  recursoActivo?: boolean;
  contenido?: string | null;
}

export const listNotes = async (): Promise<Nota[]> => {
  const response = await api.get<Nota[]>("/notas");
  return response.data;
};

export const getNote = async (id: number): Promise<Nota> => {
  const response = await api.get<Nota>(`/notas/${id}`);
  return response.data;
};

export const createNote = async (data: CreateNotaRequest): Promise<Nota> => {
  const response = await api.post<Nota>("/notas", data);
  return response.data;
};

export const updateNote = async (
  id: number,
  data: UpdateNotaRequest
): Promise<Nota> => {
  const response = await api.put<Nota>(`/notas/${id}`, data);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notas/${id}`);
};

const notas: Nota[] = [
  {
    id: 1,
    nombre: "Nota sin DTO",
    fechaCreacion: "2025-09-30T21:45:00",
    recursoActivo: true,
    contenido: null,
  },
  {
    id: 2,
    nombre: "Otra nota",
    fechaCreacion: "2025-09-30T22:00:00",
    recursoActivo: false,
    contenido: "Contenido de la nota",
  },
];

export async function getAllNotes() {
  return api.get<Nota[]>("/notas").then((response) => response.data);
}
