package handler

import (
	"example/eventapi/middleware"
	"example/eventapi/store"
	"net/http"

	"github.com/labstack/echo/v4"
)

var (
	HTTPErrInvalidID = echo.NewHTTPError(http.StatusBadRequest, "id must be a valid UUID")
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
	eventGroup.GET("", h.FindEvents)
	eventGroup.GET("/:id", h.FindEventByID)
	eventGroup.POST("", h.CreateEvent)
	eventGroup.GET("/:id/participations", h.FindParticipationsByEventID)
	eventGroup.POST("/:id/participations", h.CreateParticipation)
	eventGroup.GET("/request-admin-session-token", h.RequestEventAdminSession)
	eventGroup.PUT("/:id/edit", h.EditEvent, middleware.JWTEventMiddleware)
	eventGroup.DELETE("/:id", h.DeleteEvent, middleware.JWTEventMiddleware)

	participationGroup := g.Group("/participations")
	participationGroup.GET("/request-admin-session", h.RequestParticipationAdminSession)
	participationGroup.DELETE("/:id", h.DeleteParticipation)
	participationGroup.GET("/counts", h.FindParticipationCountsByEventID)
}
