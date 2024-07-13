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
    console.log(body);
    const parseResult = z.array(eventResponseSchema).safeParse(body);
    if (!parseResult.success) {
      console.error(
        "Received events in an unrecognized format",
        parseResult.error
      );
      throw new Error("Failed to fetch events");
    }
    console.log(parseResult.data);

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

    for (let i = 0; i < 2000; i++) {
      if (
        !parseResult.data.participantLimit ||
        parseResult.data.inEvent.length < parseResult.data.participantLimit
      ) {
        parseResult.data.inEvent = parseResult.data.inEvent.concat([
          {
            id: Math.floor(Math.random() * 10000).toString(),
            firstName: `Test ${i}`,
            lastName: "Tester",
            email: "test@example.com",
            eventId: eventId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } else {
        parseResult.data.inQueue = parseResult.data.inQueue.concat([
          {
            id: Math.floor(Math.random() * 10000).toString(),
            firstName: `Test ${i}`,
            lastName: "Tester",
            email: "test@example.com",
            eventId: eventId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
      parseResult.data.participantCount++;
    }

    return parseResult.data;
  } catch (e) {
    console.error("Failed to fetch participations", e);
    throw e;
  }
};
