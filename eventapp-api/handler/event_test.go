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
