package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	ID                    uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	Name                  string
	Description           string
	Location              string
	StartsAt              time.Time
	EndsAt                time.Time
	ParticipantLimit      *int64
	ParticipationStartsAt time.Time
	ParticipationEndsAt   time.Time
	Visibility            string
	AdminCode             string
	ExpiresAt             time.Time
	Participations        []Participation `gorm:"foreignKey:EventID"`
	ParticipantCount      int64           `gorm:"default:0"`
}

type EventCreate struct {
	Name                  string    `json:"name" validate:"required,max=50"`
	Description           string    `json:"description" validate:"required,max=3000"`
	Location              string    `json:"location" validate:"required,max=100"`
	StartsAt              time.Time `json:"startsAt" validate:"required"`
	EndsAt                time.Time `json:"endsAt" validate:"required,gte,gtfield=StartsAt"`
	ParticipantLimit      *int64    `json:"participantLimit" validate:"omitnil,min=1"`
	ParticipationStartsAt time.Time `json:"participationStartsAt" validate:"required"`
	ParticipationEndsAt   time.Time `json:"participationEndsAt" validate:"required,gte,gtfield=ParticipationStartsAt"`
	Visibility            string    `json:"visibility" validate:"oneof=public private"`
	ExpiresAt             time.Time `json:"expiresAt" validate:"required,gte"`
}

type EventCreateResponse struct {
	ID                    uuid.UUID `json:"id"`
	Name                  string    `json:"name"`
	Description           string    `json:"description"`
	Location              string    `json:"location"`
	StartsAt              time.Time `json:"startsAt"`
	EndsAt                time.Time `json:"endsAt"`
	ParticipantLimit      *int64    `json:"participantLimit"`
	ParticipationStartsAt time.Time `json:"participationStartsAt"`
	ParticipationEndsAt   time.Time `json:"participationEndsAt"`
	Visibility            string    `json:"visibility"`
	AdminCode             string    `json:"adminCode"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
	ExpiresAt             time.Time `json:"expiresAt"`
}

type EventResponse struct {
	ID                    uuid.UUID `json:"id"`
	Name                  string    `json:"name"`
	Description           string    `json:"description"`
	Location              string    `json:"location"`
	StartsAt              time.Time `json:"startsAt"`
	EndsAt                time.Time `json:"endsAt"`
	ParticipantLimit      *int64    `json:"participantLimit"`
	ParticipationStartsAt time.Time `json:"participationStartsAt"`
	ParticipationEndsAt   time.Time `json:"participationEndsAt"`
	Visibility            string    `json:"visibility"`
	ParticipantCount      int64     `json:"participantCount"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
}

type EventEdit struct {
	Name                  string    `json:"name" validate:"required,max=50"`
	Description           string    `json:"description" validate:"required,max=3000"`
	Location              string    `json:"location" validate:"required,max=100"`
	StartsAt              time.Time `json:"startsAt" validate:"required"`
	EndsAt                time.Time `json:"endsAt" validate:"required,gte,gtfield=StartsAt"`
	ParticipantLimit      *int64    `json:"participantLimit" validate:"omitnil,min=1"`
	ParticipationStartsAt time.Time `json:"participationStartsAt" validate:"required"`
	ParticipationEndsAt   time.Time `json:"participationEndsAt" validate:"required,gte,gtfield=ParticipationStartsAt"`
	Visibility            string    `json:"visibility" validate:"oneof=public private"`
}

type EventEditResponse struct {
	ID                    uuid.UUID `json:"id"`
	Name                  string    `json:"name"`
	Description           string    `json:"description"`
	Location              string    `json:"location"`
	StartsAt              time.Time `json:"startsAt"`
	EndsAt                time.Time `json:"endsAt"`
	ParticipantLimit      *int64    `json:"participantLimit"`
	ParticipationStartsAt time.Time `json:"participationStartsAt"`
	ParticipationEndsAt   time.Time `json:"participationEndsAt"`
	Visibility            string    `json:"visibility"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
	ExpiresAt             time.Time `json:"expiresAt"`
}
