package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Participation struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	FirstName string
	LastName  string
	Email     string
	AdminCode string
	EventID   uuid.UUID
}

type ParticipationCreate struct {
	FirstName string `json:"firstName" validate:"required,max=50"`
	LastName  string `json:"lastName" validate:"required,max=50"`
	Email     string `json:"email" validate:"required,email,max=100"`
}

type ParticipationCreateResponse struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
	AdminCode string    `json:"adminCode"`
	EventID   uuid.UUID `json:"eventId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ParticipationResponse struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
	EventID   uuid.UUID `json:"eventId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Participations struct {
	InEvent          []ParticipationResponse `json:"inEvent"`
	InQueue          []ParticipationResponse `json:"inQueue"`
	ParticipantCount int64                   `json:"participantCount"`
	ParticipantLimit *int64                  `json:"participantLimit"`
}

type ParticipantCountsQuery struct {
	EventIDs uuid.UUIDs `json:"eventIds" validate:"required,min=1"`
}

type EventParticipantCount struct {
	EventID uuid.UUID
	Count   int64
}
