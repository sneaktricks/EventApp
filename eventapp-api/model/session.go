package model

import "github.com/google/uuid"

type EventAdminSessionResponse struct {
	EventID    uuid.UUID `json:"eventId"`
	AdminToken string    `json:"adminToken"`
}

type ParticipationAdminSessionResponse struct {
	ParticipationID uuid.UUID `json:"participationId"`
	AdminToken      string    `json:"adminToken"`
}
