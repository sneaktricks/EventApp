export interface IEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  participantCount: number;
  participantLimit?: number | null;
  participationStartsAt: Date;
  participationEndsAt: Date;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventCreate {
  name: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  participantLimit?: number | null;
  participationStartsAt: Date;
  participationEndsAt: Date;
  visibility: EventVisibility;
  expiresAt: Date;
}

export interface IEventCreateResponse {
  id: string;
  name: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  participantLimit?: number | null;
  participationStartsAt: Date;
  participationEndsAt: Date;
  visibility: string;
  adminCode: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export enum AlertStyle {
  Success,
  Warning,
  Error,
  Info,
}

export type EventVisibility = "public" | "private";

export interface IEventInputs {
  name: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  hasParticipantLimit: boolean;
  participantLimit?: number;
  participationStartsAt: Date;
  participationEndsAt: Date;
  visibility: EventVisibility;
  expiresAt: Date;
}

export interface IParticipation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParticipations {
  inEvent: readonly IParticipation[];
  inQueue: readonly IParticipation[];
  participantCount: number;
  participantLimit?: number | null;
}

export interface IParticipationCreate {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IParticipationCreateResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  adminCode: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventAdminSessionResponse {
  eventId: string;
  adminToken: string;
}
