package handler_test

import (
	"context"
	"example/eventapi/handler"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"example/eventapi/router"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func pointer[T any](x T) *T {
	return &x
}

func NewTestHandler() (r *echo.Echo, h *handler.Handler) {
	r = router.New()

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
			},
		},
	}
	ps := MockParticipationStore{}

	h = handler.New(&es, &ps)

	return r, h
}

type MockEventStore struct {
	events []model.Event
}

func (es *MockEventStore) FindAll(ctx context.Context, params query.PaginationParams) (events []model.EventResponse, err error) {
	panic("not implemented") // TODO: Implement
}

func (es *MockEventStore) FindByID(ctx context.Context, id uuid.UUID) (event model.EventResponse, err error) {
	panic("not implemented") // TODO: Implement
}

func (es *MockEventStore) Create(ctx context.Context, createData *model.EventCreate) (event model.EventCreateResponse, err error) {
	panic("not implemented") // TODO: Implement
}

func (es *MockEventStore) FindEventIDByAdminCode(ctx context.Context, adminCode string) (eventID uuid.UUID, err error) {
	panic("not implemented") // TODO: Implement
}

func (es *MockEventStore) Edit(ctx context.Context, eventID uuid.UUID, editData *model.EventEdit) error {
	panic("not implemented") // TODO: Implement
}

func (es *MockEventStore) Delete(ctx context.Context, id uuid.UUID) error {
	panic("not implemented") // TODO: Implement
}

type MockParticipationStore struct {
	participations []model.Participation
}

func (ps *MockParticipationStore) FindAllInEvent(ctx context.Context, eventID uuid.UUID, params query.PaginationParams) (participations model.Participations, err error) {
	panic("not implemented") // TODO: Implement
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
