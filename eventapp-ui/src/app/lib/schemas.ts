import { ZodSchema, z } from "zod";
import {
  IEvent,
  IEventAdminSessionResponse,
  IEventCreateResponse,
  IEventEditInputs,
  IEventInputs,
  IParticipation,
  IParticipationCreate,
  IParticipationCreateResponse,
  IParticipations,
} from "./definitions";

export const eventCreateFormSchema: ZodSchema<IEventInputs> = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be at most 50 characters long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(3000, "Description must be at most 3000 characters long"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location must be at most 100 characters long"),
    startsAt: z.coerce.date().refine(
      (data) => data.getTime() > Date.now() + 1000 * 60, // minimum 1 minute in the future
      "The event must start in the future"
    ),
    endsAt: z.coerce.date(),
    hasParticipantLimit: z.coerce.boolean(),
    participantLimit: z.optional(
      z.coerce
        .number()
        .int("Participant limit must be an integer")
        .gte(1, "Participant limit must be at least 1")
        .lte(
          Number.MAX_SAFE_INTEGER,
          "Participant limit must be sensible (that is, at most 9,007,199,254,740,991)"
        )
    ),
    participationStartsAt: z.coerce.date(),
    participationEndsAt: z.coerce.date().refine(
      (data) => data.getTime() > Date.now() + 1000 * 60, // minimum 1 minute in the future
      "Participation must end in the future"
    ),
    visibility: z.enum(["public", "private"], {
      invalid_type_error:
        "Please select a visibility option (either public or private)",
    }),
    expiresAt: z.coerce.date().refine(
      (data) => data.getTime() > Date.now() + 1000 * 60, // minimum 1 minute in the future
      "The event must expire in the future"
    ),
  })
  .refine((data) => data.startsAt < data.endsAt, {
    message: "The event must not end before it starts",
    path: ["endsAt"],
  })
  .refine((data) => data.participationStartsAt < data.participationEndsAt, {
    message: "Participation must not end before it starts",
    path: ["participationEndsAt"],
  })
  .refine(
    (data) =>
      !data.hasParticipantLimit ||
      (!!data.participantLimit && data.participantLimit >= 1),
    {
      message: "Participant limit must be a valid number",
      path: ["maxParticipants"],
    }
  );

export const eventResponseSchema: ZodSchema<IEvent> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  participantCount: z.coerce.number().int(),
  participantLimit: z.nullable(z.coerce.number().int()),
  participationStartsAt: z.coerce.date(),
  participationEndsAt: z.coerce.date(),
  visibility: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const eventCreateResponseSchema: ZodSchema<IEventCreateResponse> =
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    location: z.string(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    participantLimit: z.optional(z.coerce.number().int()),
    participationStartsAt: z.coerce.date(),
    participationEndsAt: z.coerce.date(),
    visibility: z.string(),
    adminCode: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    expiresAt: z.coerce.date(),
  });

export const participationSchema: ZodSchema<IParticipation> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  eventId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const participationsResponseSchema: ZodSchema<IParticipations> =
  z.object({
    inEvent: z.array(participationSchema),
    inQueue: z.array(participationSchema),
    participantCount: z.coerce.number().int(),
    participantLimit: z.optional(z.coerce.number().int()),
  });

export const participationCreateSchema: ZodSchema<IParticipationCreate> =
  z.object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be at most 50 characters long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be at most 50 characters long"),
    email: z
      .string()
      .email("Please provide a valid email address")
      .min(1, "Email is required")
      .max(100, "Email must be at most 100 characters long"),
  });

export const participationCreateResponseSchema: ZodSchema<IParticipationCreateResponse> =
  z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    eventId: z.string(),
    adminCode: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  });

export const eventAdminSessionResponseSchema: ZodSchema<IEventAdminSessionResponse> =
  z.object({
    eventId: z.string(),
    adminToken: z.string(),
  });

export const getEventEditFormSchema = (
  eventData: IEvent
): ZodSchema<IEventEditInputs> =>
  z
    .object({
      name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be at most 50 characters long"),
      description: z
        .string()
        .min(1, "Description is required")
        .max(3000, "Description must be at most 3000 characters long"),
      location: z
        .string()
        .min(1, "Location is required")
        .max(100, "Location must be at most 100 characters long"),
      startsAt: z.coerce
        .date()
        .refine(
          (data) => data > eventData.createdAt,
          "The event must start after its initial creation date and time"
        ),
      endsAt: z.coerce.date(),
      hasParticipantLimit: z.coerce.boolean(),
      participantLimit: z.optional(
        z.coerce
          .number()
          .int("Participant limit must be an integer")
          .gte(1, "Participant limit must be at least 1")
          .lte(
            Number.MAX_SAFE_INTEGER,
            "Participant limit must be sensible (that is, at most 9,007,199,254,740,991)"
          )
      ),
      participationStartsAt: z.coerce.date(),
      participationEndsAt: z.coerce
        .date()
        .refine(
          (data) => data > eventData.createdAt,
          "Participation must end after the initial creation date and time of the event"
        ),
      visibility: z.enum(["public", "private"], {
        invalid_type_error:
          "Please select a visibility option (either public or private)",
      }),
    })
    .refine((data) => data.startsAt < data.endsAt, {
      message: "The event must not end before it starts",
      path: ["endsAt"],
    })
    .refine((data) => data.participationStartsAt < data.participationEndsAt, {
      message: "Participation must not end before it starts",
      path: ["participationEndsAt"],
    })
    .refine(
      (data) =>
        !data.hasParticipantLimit ||
        (!!data.participantLimit && data.participantLimit >= 1),
      {
        message: "Participant limit must be a valid number",
        path: ["maxParticipants"],
      }
    );
