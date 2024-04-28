package store

import (
	"context"
	"database/sql/driver"
	"encoding/base64"
	"errors"
	"example/eventapi/admincode"
	"example/eventapi/dal"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrParticipationNotFound = errors.New("participation not found")
)

type ParticipationStore interface {
	FindAllInEvent(ctx context.Context, eventID uuid.UUID, params query.PaginationParams) (participations model.Participations, err error)
	FindParticipantCountsByEventID(ctx context.Context, eventIDs uuid.UUIDs) (participationCounts map[uuid.UUID]int64, err error)
	Create(ctx context.Context, eventID uuid.UUID, pc *model.ParticipationCreate) (participation model.ParticipationCreateResponse, err error)
	FindParticipationIDByAdminCode(ctx context.Context, adminCode string) (participationID uuid.UUID, err error)
	// Delete(ctx context.Context, id uuid.UUID, adminCode string) error
}

type GormParticipationStore struct {
	query *dal.Query
}

func NewGormParticipationStore(query *dal.Query) *GormParticipationStore {
	return &GormParticipationStore{
		query: query,
	}
}

func (ps *GormParticipationStore) FindAllInEvent(ctx context.Context, eventID uuid.UUID, params query.PaginationParams) (participations model.Participations, err error) {
	e := ps.query.Event
	event, err := e.WithContext(ctx).Where(e.ID.Eq(eventID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.Participations{}, ErrEventNotFound
		}
	}

	p := ps.query.Participation
	dbParticipations, _, err := p.WithContext(ctx).
		Where(p.EventID.Eq(eventID)).
		Order(p.CreatedAt.Asc()).
		FindByPage((params.Page-1)*params.Limit, params.Limit)
	if err != nil {
		return model.Participations{}, err
	}

	participations = model.Participations{
		InEvent:          make([]model.ParticipationResponse, 0),
		InQueue:          make([]model.ParticipationResponse, 0),
		ParticipantLimit: event.ParticipantLimit,
	}
	for i, p := range dbParticipations {
		participation := model.ParticipationResponse{
			ID:        p.ID,
			FirstName: p.FirstName,
			LastName:  p.LastName,
			Email:     p.Email,
			EventID:   p.EventID,
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		}

		if event.ParticipantLimit == nil || i < int(*event.ParticipantLimit) {
			participations.InEvent = append(participations.InEvent, participation)
		} else {
			participations.InQueue = append(participations.InQueue, participation)
		}
	}
	participations.ParticipantCount = int64(len(participations.InEvent) + len(participations.InQueue))

	return participations, nil
}

func (ps *GormParticipationStore) Create(ctx context.Context, eventID uuid.UUID, pc *model.ParticipationCreate) (participation model.ParticipationCreateResponse, err error) {
	e := ps.query.Event
	_, err = e.WithContext(ctx).Where(e.ID.Eq(eventID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.ParticipationCreateResponse{}, ErrEventNotFound
		}
	}

	// Generate and encode edit code
	adminCode, err := admincode.Generate()
	if err != nil {
		return model.ParticipationCreateResponse{}, fmt.Errorf("failed to generate edit code: %w", err)
	}
	adminCodeHash, err := admincode.DeriveHash(adminCode)
	if err != nil {
		return model.ParticipationCreateResponse{}, fmt.Errorf("failed to hash edit code: %w", err)
	}
	b64EncodedAdminCodeHash := base64.StdEncoding.EncodeToString(adminCodeHash)

	p := ps.query.Participation
	dbParticipation := model.Participation{
		FirstName: pc.FirstName,
		LastName:  pc.LastName,
		Email:     pc.Email,
		AdminCode: b64EncodedAdminCodeHash,
		EventID:   eventID,
	}

	// Create participation and increment participant count in a transaction
	err = ps.query.Transaction(func(tx *dal.Query) error {
		if err := p.WithContext(ctx).Create(&dbParticipation); err != nil {
			return err
		}
		if _, err := e.WithContext(ctx).Where(e.ID.Eq(eventID)).UpdateSimple(e.ParticipantCount.Add(1)); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return model.ParticipationCreateResponse{}, fmt.Errorf("failed to create participation: %w", err)
	}

	participation = model.ParticipationCreateResponse{
		ID:        dbParticipation.ID,
		FirstName: dbParticipation.FirstName,
		LastName:  dbParticipation.LastName,
		Email:     dbParticipation.Email,
		AdminCode: adminCode,
		EventID:   dbParticipation.EventID,
		CreatedAt: dbParticipation.CreatedAt,
		UpdatedAt: dbParticipation.UpdatedAt,
	}

	return participation, nil
}

func (ps *GormParticipationStore) FindParticipantCountsByEventID(ctx context.Context, eventIDs uuid.UUIDs) (participationCounts map[uuid.UUID]int64, err error) {
	p := ps.query.Participation

	// For some reason, the In method in the query doesn't accept (eventIDs...) as is,
	// even though uuid.UUID does implement driver.Valuer. This is a hack to get around it.
	ids := []driver.Valuer{}
	for _, id := range eventIDs {
		ids = append(ids, id)
	}

	var participationCountSlice []model.EventParticipantCount
	err = p.WithContext(ctx).
		Select(p.EventID, p.ID.Count().As("count")).
		Group(p.EventID).
		Where(p.EventID.In(ids...)).
		Scan(&participationCountSlice)
	if err != nil {
		return nil, err
	}

	participationCounts = make(map[uuid.UUID]int64)
	for _, count := range participationCountSlice {
		participationCounts[count.EventID] = count.Count
	}

	return participationCounts, nil
}

func (ps *GormParticipationStore) FindParticipationIDByAdminCode(ctx context.Context, adminCode string) (participationID uuid.UUID, err error) {
	e := ps.query.Event
	p := ps.query.Participation

	hash, err := admincode.DeriveHash(adminCode)
	if err != nil {
		return uuid.UUID{}, err
	}
	b64EncodedAdminCodeHash := base64.StdEncoding.EncodeToString(hash)

	participation, err := p.WithContext(ctx).Where(p.AdminCode.Eq(b64EncodedAdminCodeHash)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return uuid.UUID{}, ErrParticipationNotFound
		}
		return uuid.UUID{}, err
	}
	event, err := e.WithContext(ctx).Where(e.ID.Eq(participation.EventID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return uuid.UUID{}, ErrParticipationNotFound
		}
		return uuid.UUID{}, err
	}
	if event.ExpiresAt.Before(time.Now()) {
		return uuid.UUID{}, ErrParticipationNotFound
	}

	return participation.ID, nil
}
