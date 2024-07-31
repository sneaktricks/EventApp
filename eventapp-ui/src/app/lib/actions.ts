"use server";

import { redirect } from "next/navigation";
import {
  IEventAdminSessionResponse,
  IEventCreate,
  IEventCreateResponse,
  IEventEdit,
  IParticipationCreate,
  IParticipationCreateResponse,
} from "./definitions";
import { revalidateTag } from "next/cache";
import {
  eventAdminSessionResponseSchema,
  eventCreateResponseSchema,
  participationCreateResponseSchema,
} from "./schemas";
import { cookies } from "next/headers";

export type ActionResponse = {
  message: string;
};

export const createEvent = async (
  event: IEventCreate
): Promise<ActionResponse> => {
  let eventCreateResponse: IEventCreateResponse;
  await new Promise((r) => setTimeout(r, 3000));
  try {
    const url = `${process.env.API_URL}/events`;
    const resp = await fetch(url, {
      body: JSON.stringify(event),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) {
      console.error(
        `POST ${url} returned a non-ok status code: ${resp.status}: ${resp.statusText}`
      );
      return {
        message:
          "Failed to create event: API responded with a non-ok status code",
      };
    }
    const body = await resp.json();
    const parseResult = await eventCreateResponseSchema.safeParseAsync(body);
    if (!parseResult.success) {
      console.error(
        "Received a malformed event create response",
        parseResult.error
      );
      return {
        message:
          "Received an unexpected response from the server. Please try again in a moment.",
      };
    }
    eventCreateResponse = parseResult.data;
  } catch (e) {
    console.error("Failed to create event", e);
    return { message: "Failed to create event" };
  }

  revalidateTag("events");
  redirect(
    `/events/create/success?eventName=${eventCreateResponse.name}&eventId=${eventCreateResponse.id}&adminCode=${eventCreateResponse.adminCode}`
  );
};

export const submitParticipation = async (
  eventId: string,
  participation: IParticipationCreate
): Promise<ActionResponse> => {
  let participationCreateResponse: IParticipationCreateResponse;
  await new Promise((r) => setTimeout(r, 3000));
  try {
    const url = `${process.env.API_URL}/events/${eventId}/participations`;
    const resp = await fetch(url, {
      body: JSON.stringify(participation),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) {
      console.error(
        `POST ${url} returned a non-ok status code: ${resp.status}: ${resp.statusText}`
      );
      return {
        message:
          "Failed to participate: API responded with a non-ok status code",
      };
    }
    const body = await resp.json();
    const parseResult = await participationCreateResponseSchema.safeParseAsync(
      body
    );
    if (!parseResult.success) {
      console.error(
        "Received a malformed participation response",
        parseResult.error
      );
      return {
        message:
          "Received an unexpected response from the server. Please try again in a moment.",
      };
    }
    participationCreateResponse = parseResult.data;
  } catch (e) {
    console.error("Failed to participate", e);
    return { message: "Failed to participate" };
  }

  revalidateTag("events");
  redirect(
    `/events/${eventId}/participate/success?eventId=${eventId}&adminCode=${participationCreateResponse.adminCode}`
  );
};

export const submitEventAdminCode = async (
  code: string
): Promise<ActionResponse> => {
  let eventAdminSessionResponse: IEventAdminSessionResponse;
  try {
    const url = `${process.env.API_URL}/events/request-admin-session-token`;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: code,
      },
    });
    if (!resp.ok) {
      if (resp.status === 404) {
        return {
          message: "No event was found by the provided code or it has expired",
        };
      }
      console.error(
        `GET ${url} returned a non-ok status code: ${resp.status}: ${resp.statusText}`
      );
      return {
        message:
          "Failed to participate: API responded with a non-ok status code",
      };
    }
    const body = await resp.json();
    const parseResult = await eventAdminSessionResponseSchema.safeParseAsync(
      body
    );
    if (!parseResult.success) {
      console.error(
        "Received a malformed event admin session response",
        parseResult.error
      );
      return {
        message:
          "Received an unexpected response from the server. Please try again in a moment.",
      };
    }
    eventAdminSessionResponse = parseResult.data;
  } catch (e) {
    console.error("Failed to fetch event", e);
    return { message: "Failed to fetch event" };
  }

  cookies().set(
    "eventApp_event_admin_token",
    eventAdminSessionResponse.adminToken
  );
  redirect(`/events/${eventAdminSessionResponse.eventId}/edit`);
};

export const submitParticipationAdminCode = async (
  code: string
): Promise<ActionResponse> => {
  if (code === "123456-ABCDEF-123456") {
    return { message: "Success" };
  } else {
    return { message: "The code is incorrect!" };
  }
};

export const editEvent = async (
  eventId: string,
  editData: IEventEdit
): Promise<ActionResponse> => {
  try {
    const url = `${process.env.API_URL}/events/${eventId}/edit`;
    const resp = await fetch(url, {
      body: JSON.stringify(editData),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("eventApp_event_admin_token")?.value
        }`,
      },
    });
    if (!resp.ok) {
      console.error(
        `PUT ${url} returned a non-ok status code: ${resp.status}: ${resp.statusText}`
      );
      return {
        message:
          "Failed to create event: API responded with a non-ok status code",
      };
    }
  } catch (e) {
    console.error("Failed to create event", e);
    return { message: "Failed to create event" };
  }

  revalidateTag("events");
  redirect(`/events/${eventId}`);
};

export const deleteEvent = async (eventId: string): Promise<ActionResponse> => {
  try {
    const url = `${process.env.API_URL}/events/${eventId}`;
    const resp = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("eventApp_event_admin_token")?.value
        }`,
      },
    });
    if (!resp.ok) {
      console.error(
        `DELETE ${url} returned a non-ok status code: ${resp.status}: ${resp.statusText}`
      );
      return {
        message:
          "Failed to delete event: API responded with a non-ok status code",
      };
    }
  } catch (e) {
    console.error("Failed to create event", e);
    return { message: "Failed to create event" };
  }

  revalidateTag("events");
  redirect("/events");
};

export const deleteParticipation = async (
  participationId: string
): Promise<ActionResponse> => {
  try {
    const url = `${process.env.API_URL}/participations/${participationId}`;
    const resp = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("eventApp_event_admin_token")?.value
        }`,
      },
    });
    if (!resp.ok) {
      console.error(
        `DELETE ${url} returned a non-ok status code: ${resp.status}: ${resp.statusText}`
      );
      return {
        message:
          "Failed to unparticipate: API responded with a non-ok status code",
      };
    }
  } catch (e) {
    console.error("Failed to unparticipate", e);
    return { message: "Failed to unparticipate" };
  }

  revalidateTag("events");
  revalidateTag("participations");
  redirect("/events");
};
