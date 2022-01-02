package profile

import (
	"context"
	"fmt"
)

type NotFoundError struct {
	ProfileID string
}

func (e NotFoundError) Error() string {
	return fmt.Sprintf("profile '%s' not found", e.ProfileID)
}

type UnauthorizedError struct {
	ProfileID string
	UserID    string
}

func (e UnauthorizedError) Error() string {
	return fmt.Sprintf(
		"user '%s' is not authorized to perform operations for profile '%s'",
		e.UserID,
		e.ProfileID,
	)
}

type Repository interface {
	GetProfile(ctx context.Context, profileId string) (*Profile, error)
	CreateProfile(ctx context.Context, pr *Profile) error
}
