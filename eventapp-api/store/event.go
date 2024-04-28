package store

import (
	"context"
	"encoding/base64"
	"errors"
	"example/eventapi/admincode"
	"example/eventapi/dal"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrEventNotFound = errors.New("event not found")
)

type EventStore interface {
	FindAll(ctx context.Context, params query.PaginationParams) (events []model.EventResponse, err error)
	FindByID(ctx context.Context, id uuid.UUID) (event model.EventResponse, err error)
	Create(ctx context.Context, ec *model.EventCreate) (event model.EventCreateResponse, err error)
}

type GormEventStore struct {
	query *dal.Query
}

func NewGormEventStore(query *dal.Query) *GormEventStore {
	return &GormEventStore{
		query: query,
	}
}

func (es *GormEventStore) FindAll(ctx context.Context, params query.PaginationParams) (events []model.EventResponse, err error) {
	e := es.query.Event

	dbEvents, _, err := e.WithContext(ctx).
		Where(e.Visibility.Eq("public")).
		FindByPage((params.Page-1)*params.Limit, params.Limit)
	if err != nil {
		return nil, err
	}

	events = make([]model.EventResponse, len(dbEvents))
	for i, ev := range dbEvents {
		events[i] = model.EventResponse{
			ID:                    ev.ID,
			Name:                  ev.Name,
			Description:           ev.Description,
			Location:              ev.Location,
			StartsAt:              ev.StartsAt,
			EndsAt:                ev.EndsAt,
			ParticipantLimit:      ev.ParticipantLimit,
			ParticipationStartsAt: ev.ParticipationStartsAt,
			ParticipationEndsAt:   ev.ParticipationEndsAt,
			Visibility:            ev.Visibility,
			ParticipantCount:      ev.ParticipantCount,
			CreatedAt:             ev.CreatedAt,
			UpdatedAt:             ev.UpdatedAt,
		}
	}

	return events, nil
}

func (es *GormEventStore) FindByID(ctx context.Context, id uuid.UUID) (event model.EventResponse, err error) {
	e := es.query.Event
	dbEvent, err := e.WithContext(ctx).Where(e.ID.Eq(id)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.EventResponse{}, ErrEventNotFound
		}
		return model.EventResponse{}, err
	}

	event = model.EventResponse{
		ID:                    dbEvent.ID,
		Name:                  dbEvent.Name,
		Description:           dbEvent.Description,
		Location:              dbEvent.Location,
		StartsAt:              dbEvent.StartsAt,
		EndsAt:                dbEvent.EndsAt,
		ParticipantLimit:      dbEvent.ParticipantLimit,
		ParticipationStartsAt: dbEvent.ParticipationStartsAt,
		ParticipationEndsAt:   dbEvent.ParticipationEndsAt,
		Visibility:            dbEvent.Visibility,
		ParticipantCount:      dbEvent.ParticipantCount,
		CreatedAt:             dbEvent.CreatedAt,
		UpdatedAt:             dbEvent.UpdatedAt,
	}

	return event, nil
}

func (es *GormEventStore) Create(ctx context.Context, ec *model.EventCreate) (event model.EventCreateResponse, err error) {
	// Generate and encode edit code
	adminCode, err := admincode.Generate()
	if err != nil {
		return model.EventCreateResponse{}, fmt.Errorf("failed to generate edit code: %w", err)
	}
	adminCodeHash, err := admincode.DeriveHash(adminCode)
	if err != nil {
		return model.EventCreateResponse{}, fmt.Errorf("failed to hash edit code: %w", err)
	}
	b64EncodedAdminCodeHash := base64.StdEncoding.EncodeToString(adminCodeHash)

	e := es.query.Event
	dbEvent := model.Event{
		Name:                  ec.Name,
		Description:           ec.Description,
		Location:              ec.Location,
		StartsAt:              ec.StartsAt,
		EndsAt:                ec.EndsAt,
		ParticipantLimit:      ec.ParticipantLimit,
		ParticipationStartsAt: ec.ParticipationStartsAt,
		ParticipationEndsAt:   ec.ParticipationEndsAt,
		Visibility:            ec.Visibility,
		AdminCode:             b64EncodedAdminCodeHash,
	}
	err = e.WithContext(ctx).Create(&dbEvent)
	if err != nil {
		return model.EventCreateResponse{}, fmt.Errorf("failed to create event: %w", err)
	}

	event = model.EventCreateResponse{
		ID:                    dbEvent.ID,
		Name:                  dbEvent.Name,
		Description:           dbEvent.Description,
		Location:              dbEvent.Location,
		StartsAt:              dbEvent.StartsAt,
		EndsAt:                dbEvent.EndsAt,
		ParticipantLimit:      dbEvent.ParticipantLimit,
		ParticipationStartsAt: dbEvent.ParticipationStartsAt,
		ParticipationEndsAt:   dbEvent.ParticipationEndsAt,
		Visibility:            dbEvent.Visibility,
		CreatedAt:             dbEvent.CreatedAt,
		UpdatedAt:             dbEvent.UpdatedAt,
		AdminCode:             adminCode,
	}

	return event, nil
}
