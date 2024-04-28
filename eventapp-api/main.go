package main

import (
	"context"
	"example/eventapi/dal"
	"example/eventapi/database"
	"example/eventapi/handler"
	"example/eventapi/router"
	"example/eventapi/store"
	"flag"
	"fmt"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
)

var (
	port = flag.Int("port", 8080, "The server port")
)

func main() {
	flag.Parse()

	r := router.New()
	mainGroup := r.Group("")
	_, err := database.InitializeDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %s\n", err.Error())
	}

	eventStore := store.NewGormEventStore(dal.Q)
	participationStore := store.NewGormParticipationStore(dal.Q)
	h := handler.New(eventStore, participationStore)
	h.RegisterRoutes(mainGroup)

	go listenForShutdownSignal(func() {
		r.Shutdown(context.TODO())
	})

	err = r.Start(fmt.Sprintf(":%d", *port))
	if err != nil {
		r.Logger.Fatal(err)
	}
}

// Listens for an `os.Interrupt` or `SIGTERM` signal
// and runs the provided `shutdownAction` when received.
func listenForShutdownSignal(shutdownAction func()) {
	s := make(chan os.Signal, 1)
	signal.Notify(s, os.Interrupt, syscall.SIGTERM)
	<-s

	slog.Info("Shutdown signal received, shutting down...")
	shutdownAction()
}
