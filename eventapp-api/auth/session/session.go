package session

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const jwtExpiration = 1 * time.Hour

var secretKey []byte

var ErrInvalidToken = errors.New("session: invalid token")

func init() {
	// Get session secret from env
	secret, ok := os.LookupEnv("SESSION_SECRET")
	if !ok {
		log.Fatalf("Environment variable SESSION_SECRET must be defined")
	}
	secretKey = []byte(secret)
}

func NewEventAdminSession(eventID uuid.UUID) (token string, err error) {
	now := time.Now()

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    "EventAppAPI",
		Audience:  jwt.ClaimStrings{"EventAppAPI"},
		Subject:   fmt.Sprintf("Event:%s", eventID.String()),
		IssuedAt:  jwt.NewNumericDate(now),
		NotBefore: jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(jwtExpiration)),
	})

	token, err = t.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return token, nil
}

func VerifyEventAdminToken(tokenString string) (eventID uuid.UUID, err error) {
	// Parse token
	token, err := jwt.ParseWithClaims(tokenString, jwt.RegisteredClaims{}, func(t *jwt.Token) (interface{}, error) {
		return secretKey, nil
	},
		// Ensure that the signing method, issuer, and audience are valid.
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Name}),
		jwt.WithIssuer("EventAppAPI"),
		jwt.WithAudience("EventAppAPI"),
		jwt.WithLeeway(5*time.Second),
	)

	// Check if a parse error occurred
	if err != nil {
		return uuid.UUID{}, err
	}
	// Check for validity
	if !token.Valid {
		return uuid.UUID{}, ErrInvalidToken
	}

	// Check that the subject has the "Event:" prefix
	subject, err := token.Claims.GetSubject()
	if err != nil {
		return uuid.UUID{}, err
	}
	if !strings.HasPrefix(subject, "Event:") {
		return uuid.UUID{}, ErrInvalidToken
	}

	// Parse subject into eventID
	eventID, err = uuid.Parse(strings.TrimPrefix(subject, "Event:"))
	if err != nil {
		return uuid.UUID{}, err
	}

	return eventID, nil
}
