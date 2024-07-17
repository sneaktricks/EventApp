import { z } from "zod";
import { IEvent, IParticipations } from "./definitions";
import { eventResponseSchema, participationsResponseSchema } from "./schemas";
import { notFound } from "next/navigation";

export const fetchEvents = async (): Promise<readonly IEvent[]> => {
  try {
    if (!process.env.API_URL) {
      throw new Error("API_URL is not defined");
    }

    const url = `${process.env.API_URL}/events`;
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
    const parseResult = z.array(eventResponseSchema).safeParse(body);
    if (!parseResult.success) {
      console.error(
        "Received events in an unrecognized format",
        parseResult.error
      );
      throw new Error("Failed to fetch events");
    }

    return parseResult.data;
  } catch (e) {
    console.error("Failed to fetch events", e);
    throw e;
  }
};

export const fetchEventById = async (id: string): Promise<IEvent> => {
  try {
    if (!process.env.API_URL) {
      throw new Error("API_URL is not defined");
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
      console.error(`${url} returned a non-ok status code`);
      throw new Error("Failed to fetch event");
    }
    const body = await resp.json();
    const parseResult = eventResponseSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(
        "Received event in an unrecognized format",
        parseResult.error
      );
      throw new Error("Failed to fetch event");
    }

    return parseResult.data;
  } catch (e) {
    console.error("Failed to fetch events", e);
    throw e;
  }
};

export const fetchParticipantsByEventId = async (
  eventId: string
): Promise<IParticipations> => {
  try {
    await new Promise((r) => setTimeout(r, 3000));

    if (!process.env.API_URL) {
      throw new Error("API_URL is not defined");
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
    const parseResult = participationsResponseSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(
        "Received participations in an unrecognized format",
        parseResult.error
      );
      throw new Error("Failed to fetch participations");
    }

    return parseResult.data;
  } catch (e) {
    console.error("Failed to fetch participations", e);
    throw e;
  }
};
