package store

import (
	"context"
	"encoding/base64"
	"errors"
	"example/eventapi/auth/admincode"
	"example/eventapi/dal"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrEventNotFound = errors.New("event not found")
)

type EventStore interface {
	FindAll(ctx context.Context, params query.PaginationParams) (events []model.EventResponse, err error)
	FindByID(ctx context.Context, id uuid.UUID) (event model.EventResponse, err error)
	Create(ctx context.Context, createData *model.EventCreate) (event model.EventCreateResponse, err error)
	FindEventIDByAdminCode(ctx context.Context, adminCode string) (eventID uuid.UUID, err error)
	Edit(ctx context.Context, eventID uuid.UUID, editData *model.EventEdit) (event model.EventEditResponse, err error)
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

func (es *GormEventStore) Create(ctx context.Context, createData *model.EventCreate) (event model.EventCreateResponse, err error) {
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
		Name:                  createData.Name,
		Description:           createData.Description,
		Location:              createData.Location,
		StartsAt:              createData.StartsAt,
		EndsAt:                createData.EndsAt,
		ParticipantLimit:      createData.ParticipantLimit,
		ParticipationStartsAt: createData.ParticipationStartsAt,
		ParticipationEndsAt:   createData.ParticipationEndsAt,
		Visibility:            createData.Visibility,
		AdminCode:             b64EncodedAdminCodeHash,
		ExpiresAt:             createData.ExpiresAt,
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

func (es *GormEventStore) FindEventIDByAdminCode(ctx context.Context, adminCode string) (eventID uuid.UUID, err error) {
	e := es.query.Event

	hash, err := admincode.DeriveHash(adminCode)
	if err != nil {
		return uuid.UUID{}, err
	}
	b64EncodedAdminCodeHash := base64.StdEncoding.EncodeToString(hash)

	event, err := e.WithContext(ctx).Where(e.AdminCode.Eq(b64EncodedAdminCodeHash), e.ExpiresAt.Gt(time.Now())).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return uuid.UUID{}, ErrEventNotFound
		}
		return uuid.UUID{}, err
	}

	return event.ID, nil
}

func (es *GormEventStore) Edit(ctx context.Context, eventID uuid.UUID, editData *model.EventEdit) (event model.EventEditResponse, err error) {
	e := es.query.Event

	dbEvent := model.Event{
		Name:                  editData.Name,
		Description:           editData.Description,
		Location:              editData.Location,
		StartsAt:              editData.StartsAt,
		EndsAt:                editData.EndsAt,
		ParticipantLimit:      editData.ParticipantLimit,
		ParticipationStartsAt: editData.ParticipationStartsAt,
		ParticipationEndsAt:   editData.ParticipationEndsAt,
		Visibility:            editData.Visibility,
	}
	result, err := e.WithContext(ctx).Where(e.ID.Eq(eventID)).Updates(dbEvent)
	if err != nil {
		return model.EventEditResponse{}, err
	}
	if result.RowsAffected == 0 {
		return model.EventEditResponse{}, ErrEventNotFound
	}

	event = model.EventEditResponse{
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
	}

	return event, nil
}
