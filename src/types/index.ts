export interface Tag {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  tags: Tag[];
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
  tagIds: number[];
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
  tagIds: number[];
  archived: boolean;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  tagIds: number[];
}

export interface UpdateEventRequest {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  tagIds: number[];
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
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
