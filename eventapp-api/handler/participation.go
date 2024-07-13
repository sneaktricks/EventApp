package handler

import (
	"example/eventapi/auth/session"
	"example/eventapi/logger"
	"example/eventapi/model"
	"example/eventapi/model/query"
	"example/eventapi/store"
	"log/slog"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func (h *Handler) FindParticipationsByEventID(c echo.Context) error {
	idParam := c.Param("id")
	eventID, err := uuid.Parse(idParam)
	if err != nil {
		return HTTPErrInvalidID
	}

	queryParams := c.QueryParams()
	paginationParams := query.ParsePaginationParamsFromURLValues(queryParams)

	participations, err := h.participationStore.FindAllInEvent(c.Request().Context(), eventID, paginationParams)
	if err != nil {
		switch err {
		case store.ErrEventNotFound:
			return echo.NewHTTPError(http.StatusNotFound, err.Error())
		default:
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve participations")
		}
	}

	return c.JSON(http.StatusOK, participations)
}

func (h *Handler) CreateParticipation(c echo.Context) error {
	idParam := c.Param("id")
	eventID, err := uuid.Parse(idParam)
	if err != nil {
		return HTTPErrInvalidID
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

func (h *Handler) FindParticipationCountsByEventID(c echo.Context) error {

	var query model.ParticipationCountsQuery
	if err := c.Bind(&query); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(query); err != nil {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, err.Error())
	}

	participationCounts, err := h.participationStore.FindParticipationCountsByEventID(c.Request().Context(), query.EventIDs)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve participation counts")
	}

	return c.JSON(http.StatusOK, participationCounts)
}

func (h *Handler) RequestParticipationAdminSession(c echo.Context) error {
	header := c.Request().Header
	adminCode := header.Get("Authorization")
	if adminCode == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Authorization header must be present")
	}

	participationID, err := h.participationStore.FindParticipationIDByAdminCode(c.Request().Context(), adminCode)
	if err != nil {
		switch err {
		case store.ErrParticipationNotFound:
			return echo.NewHTTPError(http.StatusNotFound, err.Error())
		default:
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve participation")
		}
	}

	adminToken, err := session.NewParticipationAdminSession(participationID)
	if err != nil {
		logger.Logger.Error("Failed to generate participation admin JWT token", slog.String("error", err.Error()))
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to request participation admin session")
	}

	return c.JSON(http.StatusOK, model.ParticipationAdminSessionResponse{
		ParticipationID: participationID,
		AdminToken:      adminToken,
	})
}

func (h *Handler) DeleteParticipation(c echo.Context) error {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return HTTPErrInvalidID
	}

	if tokenID, ok := c.Get("participationId").(uuid.UUID); !ok || tokenID != id {
		return echo.NewHTTPError(http.StatusUnauthorized, "Path variable id and token subject don't match")
	}

	err = h.participationStore.Delete(c.Request().Context(), id)
	if err != nil {
		switch err {
		case store.ErrParticipationNotFound:
			return echo.NewHTTPError(http.StatusNotFound, err.Error())
		default:
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete participation")
		}
	}
	return c.NoContent(http.StatusNoContent)

}
