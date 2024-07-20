package handler

import (
	"example/eventapi/auth/session"
	"example/eventapi/logger"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"log/slog"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func (h *Handler) FindEvents(c echo.Context) error {
	// Bind and validate query params
	queryParams := query.PaginationParams{}
	if err := (&echo.DefaultBinder{}).BindQueryParams(c, &queryParams); err != nil {
		return HTTPError(err)
	}
	if err := c.Validate(queryParams); err != nil {
		return HTTPError(err)
	}
	// Set default param values if not defined
	if queryParams.Limit == 0 {
		queryParams.Limit = 25
	}
	if queryParams.Page == 0 {
		queryParams.Page = 1
	}

	// Retrieve events
	events, err := h.eventStore.FindAll(c.Request().Context(), queryParams)
	if err != nil {
		return HTTPError(err)
	}
	return c.JSON(http.StatusOK, events)
}

func (h *Handler) FindEventByID(c echo.Context) error {
	// Bind ID
	var id uuid.UUID
	err := echo.PathParamsBinder(c).TextUnmarshaler("id", &id).BindError()
	if err != nil {
		logger.Logger.Warn("Failed to bind ID", slog.String("error", err.Error()))
		return HTTPError(err)
	}

	// Find event by ID
	event, err := h.eventStore.FindByID(c.Request().Context(), id)
	if err != nil {
		return HTTPError(err)
	}

	return c.JSON(http.StatusOK, event)
}

func (h *Handler) CreateEvent(c echo.Context) error {
	eventCreate := model.EventCreate{}

	if err := c.Bind(&eventCreate); err != nil {
		return HTTPError(err)
	}
	if err := c.Validate(eventCreate); err != nil {
		return HTTPError(err)
	}

	event, err := h.eventStore.Create(c.Request().Context(), &eventCreate)
	if err != nil {
		logger.Logger.Error("Failed to create event", slog.String("error", err.Error()))
		return HTTPError(err)
	}

	return c.JSON(http.StatusCreated, event)
}

func (h *Handler) RequestEventAdminSession(c echo.Context) error {
	header := c.Request().Header
	adminCode := header.Get("Authorization")
	if adminCode == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Authorization header must be present")
	}

	eventID, err := h.eventStore.FindEventIDByAdminCode(c.Request().Context(), adminCode)
	if err != nil {
		return HTTPError(err)
	}

	adminToken, err := session.NewEventAdminSession(eventID)
	if err != nil {
		logger.Logger.Error("Failed to generate event admin JWT token", slog.String("error", err.Error()))
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to request event admin session")
	}

	return c.JSON(http.StatusOK, model.EventAdminSessionResponse{
		EventID:    eventID,
		AdminToken: adminToken,
	})
}

func (h *Handler) EditEvent(c echo.Context) error {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return HTTPErrInvalidID
	}

	editData := model.EventEdit{}

	if err := c.Bind(&editData); err != nil {
		return HTTPError(err)
	}
	if err := c.Validate(editData); err != nil {
		return HTTPError(err)
	}
	if tokenID, ok := c.Get("eventId").(uuid.UUID); !ok || tokenID != id {
		return echo.NewHTTPError(http.StatusUnauthorized, "Path variable id and token subject don't match")
	}

	err = h.eventStore.Edit(c.Request().Context(), id, &editData)
	if err != nil {
		return HTTPError(err)
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *Handler) DeleteEvent(c echo.Context) error {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return HTTPErrInvalidID
	}

	if tokenID, ok := c.Get("eventId").(uuid.UUID); !ok || tokenID != id {
		return echo.NewHTTPError(http.StatusUnauthorized, "Path variable id and token subject don't match")
	}

	err = h.eventStore.Delete(c.Request().Context(), id)
	if err != nil {
		return HTTPError(err)
	}

	return c.NoContent(http.StatusNoContent)
}
