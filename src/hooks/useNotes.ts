import { useState } from "react";
import { CreateNotaRequest, UpdateNotaRequest, Nota } from "../services/notes";
import * as notesService from "../services/notes";

export const useNotes = () => {
  const [notes, setNotes] = useState<Nota[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notesService.listNotes();
      setNotes(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch notes");
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
      setError(err.response?.data?.message || "Failed to fetch note");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (data: CreateNotaRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newNote = await notesService.createNote({
        ...data,
        fechaCreacion: new Date().toISOString(),
      });
      return newNote;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create note");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (id: number, data: UpdateNotaRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedNote = await notesService.updateNote(id, data);
      return updatedNote;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update note");
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
      setError(err.response?.data?.message || "Failed to delete note");
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
