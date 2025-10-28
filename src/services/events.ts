import { Tag } from "./../types/index";
import api from "./api";
import { CreateEventRequest, UpdateEventRequest } from "../types";
export interface Evento {
  id: number;
  nombre: string;
  fechaCreacion: string;
  recursoActivo: boolean;
  fechaDeEvento: string;
  contenido: string | null;
  taglist?: string;
  tagList?: Tag[];
}

export const listEvents = async (): Promise<Evento[]> => {
  const response = await api.get<Evento[]>("/eventos");
  console.log("Events fetched successfully", response.data);
  return response.data;
};

export const getEvent = async (id: number): Promise<Evento> => {
  const response = await api.get<Evento>(`/eventos/${id}`);
  return response.data;
};

export const createEvent = async (
  data: CreateEventRequest
): Promise<Evento> => {
  const response = await api.post("/eventos", data);
  return response.data;
};

export const updateEvent = async (
  id: number,
  data: UpdateEventRequest
): Promise<Evento> => {
  const response = await api.put<Evento>(`/eventos/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  const response = await api.delete(`/eventos/${id}`);
  console.log("Event deleted successfully");
  return response.data;
};
