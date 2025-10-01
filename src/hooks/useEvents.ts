import { useState } from 'react';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types';
import * as eventsService from '../services/events';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.listEvents();
      setEvents(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEvent = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.getEvent(id);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (data: CreateEventRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await eventsService.createEvent(data);
      setEvents([...events, newEvent]);
      return newEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: number, data: UpdateEventRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await eventsService.updateEvent(id, data);
      setEvents(events.map(event => event.id === id ? updatedEvent : event));
      return updatedEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await eventsService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
