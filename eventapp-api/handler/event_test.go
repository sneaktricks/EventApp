package handler_test

import (
	"encoding/json"
	"example/eventapi/model"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestFindAllEvents(t *testing.T) {
	assert := assert.New(t)

	e, h := NewTestHandler()
	req := httptest.NewRequest(http.MethodGet, "/events", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(h.FindAllEvents(c)) {
		assert.Equal(http.StatusOK, rec.Code)
		var response []model.EventResponse
		assert.NoError(json.Unmarshal(rec.Body.Bytes(), &response))

		assert.Equal(uuid.MustParse("00000000-0000-4000-8000-000000000000"), response[0].ID)
		assert.Equal("Event1", response[0].Name)
		assert.NotNil(response[0].ParticipantLimit)
		assert.EqualValues(20, *response[0].ParticipantLimit)

		assert.Equal(uuid.MustParse("00000000-0000-4000-8000-000000000002"), response[1].ID)
		assert.Equal("second event", response[1].Name)
		assert.Equal("Somewhere", response[1].Location)
		assert.Nil(response[1].ParticipantLimit)
	}
}

func TestFindEventByID(t *testing.T) {
	assert := assert.New(t)

	e, h := NewTestHandler()
	req := httptest.NewRequest(http.MethodGet, "/events/00000000-0000-4000-8000-000000000002", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("00000000-0000-4000-8000-000000000002")

	if assert.NoError(h.FindEventByID(c)) {
		assert.Equal(http.StatusOK, rec.Code)
		var response model.EventResponse
		assert.NoError(json.Unmarshal(rec.Body.Bytes(), &response))

		assert.Equal(uuid.MustParse("00000000-0000-4000-8000-000000000002"), response.ID)
		assert.Equal("second event", response.Name)
		assert.Nil(response.ParticipantLimit)
	}
}

func TestFindEventByID_NonExistingEvent(t *testing.T) {
	assert := assert.New(t)

	e, h := NewTestHandler()
	req := httptest.NewRequest(http.MethodGet, "/events/00000000-0000-4000-8000-000000000003", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("00000000-0000-4000-8000-000000000003")

	if err := h.FindEventByID(c); assert.NotNil(err) {
		he, ok := err.(*echo.HTTPError)
		assert.True(ok)
		assert.Equal(http.StatusNotFound, he.Code)
	}
}
