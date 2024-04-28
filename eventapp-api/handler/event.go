package handler

import (
	"example/eventapi/model"
	"example/eventapi/model/query"
	"example/eventapi/store"
	"log/slog"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func (h *Handler) FindAllEvents(c echo.Context) error {
	queryParams := c.QueryParams()
	paginationParams := query.ParsePaginationParamsFromURLValues(queryParams)

	events, err := h.eventStore.FindAll(c.Request().Context(), paginationParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve events")
	}
	return c.JSON(http.StatusOK, events)
}

func (h *Handler) FindEventByID(c echo.Context) error {
	idParam := c.Param("id")

	id, err := uuid.Parse(idParam)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "id must be a valid UUID")
	}
	event, err := h.eventStore.FindByID(c.Request().Context(), id)
	if err != nil {
		switch err {
		case store.ErrEventNotFound:
			return echo.NewHTTPError(http.StatusNotFound, err.Error())
		default:
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve event")
		}
	}

	return c.JSON(http.StatusOK, event)
}

func (h *Handler) CreateEvent(c echo.Context) error {
	eventCreate := model.EventCreate{}

	if err := c.Bind(&eventCreate); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(eventCreate); err != nil {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, err.Error())
	}

	event, err := h.eventStore.Create(c.Request().Context(), &eventCreate)
	if err != nil {
		slog.Error("failed to create event", slog.String("error", err.Error()))
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create event")
	}

	return c.JSON(http.StatusCreated, event)
}
