"use server";

import { redirect } from "next/navigation";
import {
  IEventCreate,
  IEventCreateResponse,
  IParticipationCreate,
  IParticipationCreateResponse,
} from "./definitions";
import { revalidateTag } from "next/cache";
import {
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
  console.log(event);
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
      console.error(`POST ${url} returned a non-ok status code`);
      return {
        message:
          "Failed to create event: API responded with a non-ok status code",
      };
    }
    const body = await resp.json();
    const parseResult = eventCreateResponseSchema.safeParse(body);
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
  console.log(participation);
  let participationCreateResponse: IParticipationCreateResponse;
  await new Promise((r) => setTimeout(r, 3000));
  try {
    const url = `${process.env.API_URL}/events/${eventId}/participate`;
    const resp = await fetch(url, {
      body: JSON.stringify(participation),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) {
      console.error(`POST ${url} returned a non-ok status code`);
      return {
        message:
          "Failed to participate: API responded with a non-ok status code",
      };
    }
    const body = await resp.json();
    const parseResult = participationCreateResponseSchema.safeParse(body);
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
    `/events/${eventId}/participate/success?adminCode=${participationCreateResponse.adminCode}`
  );
};

export const submitEventAdminCode = async (
  code: string
): Promise<ActionResponse> => {
  console.log(code);
  if (code === "123456-ABCDEF-123456") {
    cookies().set("adminCode", code, {
      httpOnly: false,
      expires: Date.now() + 1000 * 60 * 60,
    });
    redirect("/events/create");
  } else {
    return { message: "The code is incorrect" };
  }
};

export const submitParticipationAdminCode = async (
  code: string
): Promise<ActionResponse> => {
  console.log(code);
  if (code === "123456-ABCDEF-123456") {
    return { message: "Success" };
  } else {
    return { message: "The code is incorrect!" };
  }
};
