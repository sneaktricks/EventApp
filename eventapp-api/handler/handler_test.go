package handler_test

import (
	"context"
	"encoding/base64"
	"example/eventapi/auth/admincode"
	"example/eventapi/handler"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"example/eventapi/router"
	"example/eventapi/store"
	"fmt"
	"slices"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func pointer[T any](x T) *T {
	return &x
}

func NewTestHandler() (r *echo.Echo, h *handler.Handler) {
	r = router.New()

	ps := MockParticipationStore{
		participations: []model.Participation{
			{
				ID:        uuid.MustParse("00000000-0000-4000-8000-000000000001"),
				FirstName: "tester",
				LastName:  "the best",
				Email:     "test@example.com",
				AdminCode: "testcode2",
				EventID:   uuid.MustParse("00000000-0000-4000-8000-000000000002"),
			},
		},
	}

	es := MockEventStore{
		events: []model.Event{
			{
				ID:                    uuid.MustParse("00000000-0000-4000-8000-000000000000"),
				Name:                  "Event1",
				Description:           "Desc1",
				Location:              "Here",
				ParticipantLimit:      pointer(int64(20)),
				StartsAt:              time.Unix(0, 0),
				EndsAt:                time.Unix(1000000, 0),
				ParticipationStartsAt: time.Unix(0, 0),
				ParticipationEndsAt:   time.Unix(500000, 0),
				Visibility:            "public",
				ExpiresAt:             time.Unix(1000000, 0),
				Participations:        []model.Participation{},
				AdminCode:             "testcode1",
			},
			{
				ID:                    uuid.MustParse("00000000-0000-4000-8000-000000000002"),
				Name:                  "second event",
				Description:           "second event description here",
				Location:              "Somewhere",
				ParticipantLimit:      nil,
				StartsAt:              time.Unix(0, 0),
				EndsAt:                time.Unix(1000000, 0),
				ParticipationStartsAt: time.Unix(0, 0),
				ParticipationEndsAt:   time.Unix(500000, 0),
				Visibility:            "public",
				ExpiresAt:             time.Unix(1000000, 0),
				Participations:        []model.Participation{ps.participations[0]},
				AdminCode:             "testcode3",
			},
		},
	}

	h = handler.New(&es, &ps)

	return r, h
}

type MockEventStore struct {
	events []model.Event
}

func (es *MockEventStore) FindAll(ctx context.Context, params query.PaginationParams) (events []model.EventResponse, err error) {
	start := params.Limit * (params.Page - 1)
	if start >= len(es.events) {
		return []model.EventResponse{}, nil
	}
	end := min(params.Limit*(params.Page), len(es.events))

	events = make([]model.EventResponse, end-start)
	for i, ev := range es.events[start:end] {
		events[i] = ev.EventResponse()
	}
	return events, nil
}

func (es *MockEventStore) FindByID(ctx context.Context, id uuid.UUID) (event model.EventResponse, err error) {
	for _, ev := range es.events {
		if ev.ID == id {
			return ev.EventResponse(), nil
		}
	}

	return model.EventResponse{}, store.ErrEventNotFound
}

func (es *MockEventStore) Create(ctx context.Context, createData *model.EventCreate) (event model.EventCreateResponse, err error) {
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

	e := createData.Event(b64EncodedAdminCodeHash)
	e.CreatedAt = time.Now()
	e.UpdatedAt = e.CreatedAt
	es.events = append(es.events, e)

	event = model.EventCreateResponse{
		ID:                    e.ID,
		Name:                  e.Name,
		Description:           e.Description,
		Location:              e.Location,
		StartsAt:              e.StartsAt,
		EndsAt:                e.EndsAt,
		ParticipantLimit:      e.ParticipantLimit,
		ParticipationStartsAt: e.ParticipationStartsAt,
		ParticipationEndsAt:   e.ParticipationEndsAt,
		Visibility:            e.Visibility,
		CreatedAt:             e.CreatedAt,
		UpdatedAt:             e.UpdatedAt,
		AdminCode:             adminCode,
	}

	return event, nil
}

func (es *MockEventStore) FindEventIDByAdminCode(ctx context.Context, adminCode string) (eventID uuid.UUID, err error) {
	hash, err := admincode.DeriveHash(adminCode)
	if err != nil {
		return uuid.UUID{}, err
	}
	b64EncodedAdminCodeHash := base64.StdEncoding.EncodeToString(hash)

	for _, ev := range es.events {
		if ev.AdminCode == b64EncodedAdminCodeHash {
			return ev.ID, nil
		}
	}

	return uuid.UUID{}, store.ErrEventNotFound
}

func (es *MockEventStore) Edit(ctx context.Context, eventID uuid.UUID, editData *model.EventEdit) error {
	for i, ev := range es.events {
		if ev.ID == eventID {
			es.events[i].Name = editData.Name
			es.events[i].Description = editData.Description
			es.events[i].Location = editData.Location
			es.events[i].StartsAt = editData.StartsAt
			es.events[i].EndsAt = editData.EndsAt
			es.events[i].ParticipantLimit = editData.ParticipantLimit
			es.events[i].ParticipationStartsAt = editData.ParticipationStartsAt
			es.events[i].ParticipationEndsAt = editData.ParticipationEndsAt
			es.events[i].Visibility = editData.Visibility
			es.events[i].UpdatedAt = time.Now()
			return nil
		}
	}

	return store.ErrEventNotFound
}

func (es *MockEventStore) Delete(ctx context.Context, id uuid.UUID) error {
	for i, ev := range es.events {
		if ev.ID == id {
			es.events = slices.Delete(es.events, i, i+1)
			return nil
		}
	}

	return store.ErrEventNotFound
}

type MockParticipationStore struct {
	participations []model.Participation
}

func (ps *MockParticipationStore) FindAllInEvent(ctx context.Context, eventID uuid.UUID, params query.PaginationParams) (participations model.Participations, err error) {
	start := params.Limit * (params.Page - 1)
	if start >= len(ps.participations) {
		return model.Participations{}, nil
	}
	end := min(params.Limit*(params.Page), len(ps.participations))

	participations = model.Participations{
		InEvent: make([]model.ParticipationResponse, 0),
		InQueue: make([]model.ParticipationResponse, 0),
	}
	for _, p := range ps.participations[start:end] {
		participations.InEvent = append(participations.InEvent, p.ParticipationResponse())
	}
	return participations, nil
}

func (ps *MockParticipationStore) FindParticipationCountsByEventID(ctx context.Context, eventIDs uuid.UUIDs) (participationCounts map[uuid.UUID]int64, err error) {
	panic("not implemented") // TODO: Implement
}

func (ps *MockParticipationStore) Create(ctx context.Context, eventID uuid.UUID, pc *model.ParticipationCreate) (participation model.ParticipationCreateResponse, err error) {
	panic("not implemented") // TODO: Implement
}

func (ps *MockParticipationStore) FindParticipationIDByAdminCode(ctx context.Context, adminCode string) (participationID uuid.UUID, err error) {
	panic("not implemented") // TODO: Implement
}

func (ps *MockParticipationStore) Delete(ctx context.Context, id uuid.UUID) error {
	panic("not implemented") // TODO: Implement
}
