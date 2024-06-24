package router

import (
	"example/eventapi/middleware"

	"github.com/labstack/echo/v4"
	echomiddleware "github.com/labstack/echo/v4/middleware"
)

func New() *echo.Echo {
	e := echo.New()
	e.Pre(echomiddleware.RemoveTrailingSlash())
	e.Use(middleware.LoggerMiddleware)
	e.Use(echomiddleware.BodyLimit("2M"))
	e.Validator = NewValidator()

	return e
}
