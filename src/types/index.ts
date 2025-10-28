export interface Tag {
  id: number;
  nombreTag: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  tags: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tagIds: string;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
  tagIds: number[];
  archived: boolean;
}

export interface CreateEventRequest {
  nombre: string;
  contenido?: string;
  fechaCreacion: string;
  fechaDeEvento?: string;
  taglist?: string;
}

export interface UpdateEventRequest {
  nombre: string;
  contenido?: string;
  fechaCreacion: string;
  fechaDeEvento?: string;
  taglist?: string;
  recursoActivo?: boolean;
}

export interface CreateTagRequest {
  nombreTag: string;
}

export interface UpdateTagRequest {
  nombreTag: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ListNotesParams {
  page?: number;
  size?: number;
  archived?: boolean;
  tag?: string;
}
