package database

import (
	"example/eventapi/dal"
	"example/eventapi/model"
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const restartAttempts = 5

func autoMigrate(db *gorm.DB) {
	db.AutoMigrate(&model.Event{}, &model.Participation{})
	log.Println("Database: Migration complete")
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
			log.Printf("Database: Failed to connect to database. Re-attempting in %s\n", waitDuration)
			time.Sleep(waitDuration)
			continue
		}
		break
	}
	log.Println("Database: Successfully connected to database")

	autoMigrate(db)
	dal.SetDefault(db)
	dal.Use(db)

	return db, nil
}
