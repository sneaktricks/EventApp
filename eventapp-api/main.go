package main

import (
	"context"
	"example/eventapi/auth/session"
	"example/eventapi/dal"
	"example/eventapi/database"
	"example/eventapi/handler"
	"example/eventapi/logger"
	"example/eventapi/router"
	"example/eventapi/store"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

var (
	port = flag.Int("port", 8080, "The server port")
)

func main() {
	flag.Parse()
	session.SetSecretKeyFromEnv()

	r := router.New()
	mainGroup := r.Group("")
	_, err := database.InitializeDB()
	if err != nil {
		logger.Logger.Error("Failed to initialize database", slog.String("error", err.Error()))
		os.Exit(1)
	}

	eventStore := store.NewGormEventStore(dal.Q)
	participationStore := store.NewGormParticipationStore(dal.Q)
	h := handler.New(eventStore, participationStore)
	h.RegisterRoutes(mainGroup)

	go listenForShutdownSignal(func() {
		r.Shutdown(context.TODO())
	})

	err = r.Start(fmt.Sprintf(":%d", *port))
	if err != http.ErrServerClosed {
		r.Logger.Fatal(err)
	}
}

// Listens for an `os.Interrupt` or `SIGTERM` signal
// and runs the provided `shutdownAction` when received.
func listenForShutdownSignal(shutdownAction func()) {
	s := make(chan os.Signal, 1)
	signal.Notify(s, os.Interrupt, syscall.SIGTERM)
	<-s

	logger.Logger.Info("Shutdown signal received, shutting down...")
	shutdownAction()
}
