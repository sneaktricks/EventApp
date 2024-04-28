package admincode

import (
	"crypto/rand"
	"errors"
	"math/big"
	"os"
	"strings"

	"golang.org/x/crypto/argon2"
)

const (
	Characters     = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	CharacterCount = len(Characters)
)

var (
	ErrPepperNotDefined = errors.New("admincode: environment variable ADMINCODE_PEPPER is not set")
)

func Generate() (code string, err error) {
	var sb strings.Builder

	for i := range 20 {
		// Split code into 6-character blocks, separated by '-'
		if i%7 == 6 {
			_, err = sb.WriteRune('-')
			if err != nil {
				return "", err
			}
			continue
		}

		// Generate random index...
		idx, err := rand.Int(rand.Reader, big.NewInt(int64(CharacterCount)))
		if err != nil {
			return "", err
		}
		// ...and append the associated character to the code buffer
		err = sb.WriteByte(Characters[idx.Int64()])
		if err != nil {
			return "", err
		}
	}

	return sb.String(), nil
}

func DeriveHash(code string) (hash []byte, err error) {
	pepper, ok := os.LookupEnv("ADMINCODE_PEPPER")
	if !ok {
		return nil, ErrPepperNotDefined
	}
	// TODO: Replace hardcoded parameters with configurable variables
	hash = argon2.IDKey([]byte(code), []byte(pepper), 2, 64*1024, 2, 64)
	return hash, nil
}
