import { useState } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest, ListNotesParams, PaginatedResponse } from '../types';
import * as notesService from '../services/notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<PaginatedResponse<Note> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async (params?: ListNotesParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await notesService.listNotes(params);
      setNotes(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNote = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await notesService.getNote(id);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (data: CreateNoteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newNote = await notesService.createNote(data);
      return newNote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (id: number, data: UpdateNoteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedNote = await notesService.updateNote(id, data);
      return updatedNote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await notesService.deleteNote(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
  };
};
