package middleware

import (
	"example/eventapi/auth/session"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

var JWTMiddleware = echojwt.WithConfig(echojwt.Config{
	ParseTokenFunc: func(c echo.Context, auth string) (interface{}, error) {
		eventID, err := session.VerifyEventAdminToken(auth)
		return eventID, err
	},
	TokenLookup: "header:Authorization:Bearer ",
	ContextKey:  "eventId",
})
