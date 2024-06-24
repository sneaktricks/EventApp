package handler

import (
	"example/eventapi/logger"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"example/eventapi/store"
	"log/slog"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func (h *Handler) FindParticipantsByEventID(c echo.Context) error {
	idParam := c.Param("id")
	eventID, err := uuid.Parse(idParam)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "id must be a valid UUID")
	}

	queryParams := c.QueryParams()
	paginationParams := query.ParsePaginationParamsFromURLValues(queryParams)

	participations, err := h.participationStore.FindAllInEvent(c.Request().Context(), eventID, paginationParams)
	if err != nil {
		switch err {
		case store.ErrEventNotFound:
			return echo.NewHTTPError(http.StatusNotFound, err.Error())
		default:
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve participants")
		}
	}

	return c.JSON(http.StatusOK, participations)
}

func (h *Handler) CreateParticipation(c echo.Context) error {
	idParam := c.Param("id")
	eventID, err := uuid.Parse(idParam)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "id must be a valid UUID")
	}

	participationCreate := model.ParticipationCreate{}
	if err := c.Bind(&participationCreate); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(participationCreate); err != nil {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, err.Error())
	}

	participation, err := h.participationStore.Create(c.Request().Context(), eventID, &participationCreate)
	if err != nil {
		logger.Logger.Error("failed to create participation", slog.String("error", err.Error()))
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create event")
	}

	return c.JSON(http.StatusCreated, participation)
}

func (h *Handler) FindParticipantCountsByEventID(c echo.Context) error {

	var query model.ParticipantCountsQuery
	if err := c.Bind(&query); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(query); err != nil {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, err.Error())
	}

	participationCounts, err := h.participationStore.FindParticipantCountsByEventID(c.Request().Context(), query.EventIDs)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve participant counts")
	}

	return c.JSON(http.StatusOK, participationCounts)
}
