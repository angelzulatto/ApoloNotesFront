import api from './api';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types';

export const listEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/events');
  return response.data;
};

export const getEvent = async (id: number): Promise<Event> => {
  const response = await api.get<Event>(`/events/${id}`);
  return response.data;
};

export const createEvent = async (data: CreateEventRequest): Promise<Event> => {
  const response = await api.post<Event>('/events', data);
  return response.data;
};

export const updateEvent = async (id: number, data: UpdateEventRequest): Promise<Event> => {
  const response = await api.put<Event>(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};
