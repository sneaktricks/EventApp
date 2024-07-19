package database

import (
	"example/eventapi/dal"
	"example/eventapi/model"
	"fmt"
	"log"
	"math/rand/v2"
	"os"
	"time"

	applogger "example/eventapi/logger"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const restartAttempts = 5

func autoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.Event{}, &model.Participation{})
	applogger.Logger.Info("Database: Migration complete")

	event1ParticipantLimit := int64(5)
	event1 := model.EventCreate{
		Name:                  "Test Event 1",
		Description:           "Welcome to Test Event 1!",
		Location:              "Online",
		StartsAt:              time.Now().Add(2 * 24 * time.Hour),
		EndsAt:                time.Now().Add(2*24*time.Hour + 2*time.Hour),
		ParticipantLimit:      &event1ParticipantLimit,
		ParticipationStartsAt: time.Now().Add(-time.Hour),
		ParticipationEndsAt:   time.Now().Add(24 * time.Hour),
		Visibility:            "public",
		ExpiresAt:             time.Now().Add(24 * time.Hour),
	}.Event("")
	db.Create(&event1)

	event2 := model.EventCreate{
		Name:                  "Meeting",
		Description:           "Something spooky...",
		Location:              "Here",
		StartsAt:              time.Now().Add(10 * 24 * time.Hour),
		EndsAt:                time.Now().Add(12 * 24 * time.Hour),
		ParticipantLimit:      nil,
		ParticipationStartsAt: time.Now().Add(3 * time.Minute),
		ParticipationEndsAt:   time.Now().Add(9 * 24 * time.Hour),
		Visibility:            "public",
		ExpiresAt:             time.Now().Add(10 * 24 * time.Hour),
	}.Event("")
	db.Create(&event2)

	for i := range 200 {
		participantLimit := 1 + rand.Int64N(100)
		event := model.EventCreate{
			Name:                  fmt.Sprintf("Event %d", i+3),
			Description:           fmt.Sprintf("Description %d", i+3),
			Location:              "Somewhere",
			StartsAt:              time.Now().Add(24 * time.Hour),
			EndsAt:                time.Now().Add(25 * time.Hour),
			ParticipantLimit:      &participantLimit,
			ParticipationStartsAt: time.Now(),
			ParticipationEndsAt:   time.Now().Add(24 * time.Hour),
			Visibility:            "public",
			ExpiresAt:             time.Now().Add(24 * time.Hour),
		}.Event("")

		db.Create(&event)
	}

	applogger.Logger.Info("Database: Initial events created")
}

var dbLogger = logger.New(
	log.New(os.Stdout, "\r\n", log.LstdFlags),
	logger.Config{
		LogLevel:             logger.Warn,
		SlowThreshold:        time.Second,
		ParameterizedQueries: true,
	},
)

func InitializeDB() (db *gorm.DB, err error) {
	user := os.Getenv("PGUSER")
	password := os.Getenv("PGPASSWORD")
	host := os.Getenv("PGHOST")
	port := os.Getenv("PGPORT")
	database := os.Getenv("PGDATABASE")

	dsn := fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%s sslmode=disable",
		user,
		password,
		database,
		host,
		port,
	)

	for i := range restartAttempts {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{TranslateError: true, Logger: dbLogger})
		if err != nil {
			if i == restartAttempts-1 {
				return nil, err
			}
			waitDuration := time.Duration(2<<i) * time.Second
			applogger.Logger.Warn(
				fmt.Sprintf("Database: Failed to connect to database. Re-attempting in %s", waitDuration),
			)
			time.Sleep(waitDuration)
			continue
		}
		break
	}
	applogger.Logger.Info("Database: Successfully connected to database")

	// Configure connection pool limits
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxOpenConns(50)
	sqlDB.SetMaxIdleConns(5)

	autoMigrate(db)
	dal.SetDefault(db)
	dal.Use(db)

	return db, nil
}
