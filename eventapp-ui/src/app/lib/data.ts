"use server";

import { z } from "zod";
import { IEvent, IEventsQuery, IParticipations } from "./definitions";
import {
  eventResponseSchema,
  eventsQuerySchema,
  participationsResponseSchema,
} from "./schemas";
import { notFound } from "next/navigation";

export const fetchEvents = async (
  query: Partial<IEventsQuery> = {}
): Promise<readonly IEvent[]> => {
  if (!process.env.API_URL) {
    console.error("API_URL is not defined");
    throw new Error("Failed to fetch events");
  }

  const queryParseResult = await eventsQuerySchema.safeParseAsync(query);
  if (!queryParseResult.success) {
    console.error("Invalid query", queryParseResult.error);
    throw new Error("Invalid query");
  }
  const { page, limit } = queryParseResult.data;

  const url = `${process.env.API_URL}/events?page=${page}&limit=${limit}`;
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 300,
      tags: ["events"],
    },
  });
  if (!resp.ok) {
    throw new Error(`${url} returned a non-ok status code`);
  }
  const body = await resp.json();
  const eventParseResult = await z
    .array(eventResponseSchema)
    .safeParseAsync(body);
  if (!eventParseResult.success) {
    console.error(
      "Received events in an unrecognized format",
      eventParseResult.error
    );
    throw new Error("Failed to fetch events");
  }

  return eventParseResult.data;
};

export const fetchEventById = async (id: string): Promise<IEvent> => {
  if (!process.env.API_URL) {
    console.error("API_URL is not defined");
    throw new Error("Failed to fetch event");
  }

  const url = `${process.env.API_URL}/events/${id}`;
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 300,
      tags: ["events"],
    },
  });
  if (!resp.ok) {
    if (resp.status === 404 || resp.status === 400) {
      notFound();
    }
    console.error(
      `${url} returned a non-ok status code: ${resp.status}: ${resp.statusText}`
    );
    throw new Error("Failed to fetch event");
  }
  const body = await resp.json();
  const parseResult = await eventResponseSchema.safeParseAsync(body);
  if (!parseResult.success) {
    console.error(
      "Received event in an unrecognized format",
      parseResult.error
    );
    throw new Error("Failed to fetch event");
  }

  return parseResult.data;
};

export const fetchParticipantsByEventId = async (
  eventId: string
): Promise<IParticipations> => {
  if (!process.env.API_URL) {
    console.error("API_URL is not defined");
    throw new Error("Failed to fetch participations");
  }

  const url = `${process.env.API_URL}/events/${eventId}/participations`;
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 300,
      tags: ["events", "participations"],
    },
  });
  if (!resp.ok) {
    if (resp.status === 404 || resp.status === 400) {
      notFound();
    }
    console.error(`${url} returned a non-ok status code`);
    throw new Error("Failed to fetch participations");
  }
  const body = await resp.json();
  const parseResult = await participationsResponseSchema.safeParseAsync(body);
  if (!parseResult.success) {
    console.error(
      "Received participations in an unrecognized format",
      parseResult.error
    );
    throw new Error("Failed to fetch participations");
  }

  return parseResult.data;
};
