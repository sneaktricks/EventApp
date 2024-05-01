package admincode

import (
	"crypto/rand"
	"errors"
	"log"
	"math/big"
	"os"
	"strings"
	"time"

	"golang.org/x/crypto/argon2"
)

type Argon2Params struct {
	Time      uint32
	Memory    uint32
	Threads   uint8
	KeyLength uint32
}

const (
	Characters     = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	CharacterCount = len(Characters)
)

var (
	ErrPepperNotDefined = errors.New("admincode: environment variable ADMINCODE_PEPPER is not set")
)

var argon2Config = Argon2Params{
	Time:      5,
	Memory:    64 * 1024,
	Threads:   2,
	KeyLength: 64,
}

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
	start := time.Now()
	hash = argon2.IDKey([]byte(code), []byte(pepper), argon2Config.Time, argon2Config.Memory, argon2Config.Threads, argon2Config.KeyLength)
	end := time.Now()
	log.Printf("admincode: Hashing took %s\n", end.Sub(start).String())
	return hash, nil
}
