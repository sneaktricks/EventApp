package handler

import (
	"example/eventapi/store"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	eventStore         store.EventStore
	participationStore store.ParticipationStore
}

func New(es store.EventStore, ps store.ParticipationStore) *Handler {
	return &Handler{
		eventStore:         es,
		participationStore: ps,
	}
}

func (h *Handler) RegisterRoutes(g *echo.Group) {
	eventGroup := g.Group("/events")
	eventGroup.GET("", h.FindAllEvents)
	eventGroup.GET("/:id", h.FindEventByID)
	eventGroup.POST("", h.CreateEvent)
	eventGroup.GET("/:id/participants", h.FindParticipantsByEventID)
	eventGroup.POST("/:id/participate", h.CreateParticipation)
	eventGroup.GET("/participant-counts", h.FindParticipantCountsByEventID)
}
