package command

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type CreateProfile struct {
	Id          string
	Tag         string
	Name        string
	Description string
}

type CreateProfileHandler struct {
	profileRepo profile.Repository
}

func NewCreateProfileHandler(profileRepo profile.Repository) CreateProfileHandler {
	if profileRepo == nil {
		panic("[command/create_profile] nil repo")
	}

	return CreateProfileHandler{profileRepo}
}

func (h CreateProfileHandler) Handle(ctx context.Context, cmd CreateProfile) error {
	pr, err := profile.NewProfile(cmd.Id, cmd.Tag, cmd.Name, cmd.Description)
	if err != nil {
		return err
	}

	if err := h.profileRepo.CreateProfile(ctx, pr); err != nil {
		return err
	}

	return nil
}
