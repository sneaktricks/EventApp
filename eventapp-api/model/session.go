package model

import "github.com/google/uuid"

type EventAdminSessionResponse struct {
	EventID    uuid.UUID `json:"eventId"`
	AdminToken string    `json:"adminToken"`
}
