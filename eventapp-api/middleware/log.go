package middleware

import (
	"context"
	"example/eventapi/log"
	"log/slog"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var LoggerMiddleware = middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogStatus:   true,
	LogURI:      true,
	LogError:    true,
	HandleError: true,
	LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
		if v.Error == nil {
			log.Logger.LogAttrs(context.Background(), slog.LevelInfo, "REQUEST",
				slog.String("uri", v.URI),
				slog.Int("status", v.Status),
			)
		} else {
			log.Logger.LogAttrs(context.Background(), slog.LevelError, "REQUEST_ERROR",
				slog.String("uri", v.URI), slog.Int("status", v.Status),
				slog.String("error", v.Error.Error()),
			)
		}
		return nil
	},
})
