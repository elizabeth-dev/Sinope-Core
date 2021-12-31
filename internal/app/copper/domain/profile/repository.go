package profile

import (
	"context"
	"fmt"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/query"
)

type NotFoundError struct {
	ProfileID string
}

func (e NotFoundError) Error() string {
	return fmt.Sprintf("profile '%s' not found", e.ProfileID)
}

type Repository interface {
	GetProfile(ctx context.Context, profileId string) (*query.Profile, error)
	CreateProfile(ctx context.Context, pr *Profile) error
}
