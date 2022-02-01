package command

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type UnfollowProfile struct {
	FromId string
	ToId   string
}

type UnfollowProfileHandler struct {
	profileRepo profile.Repository
}

func NewUnfollowProfileHandler(profileRepo profile.Repository) UnfollowProfileHandler {
	if profileRepo == nil {
		panic("[command/Unfollow_profile] nil repo")
	}

	return UnfollowProfileHandler{profileRepo}
}

func (h UnfollowProfileHandler) Handle(ctx context.Context, cmd UnfollowProfile) error {

	if err := h.profileRepo.RemoveFollower(ctx, cmd.FromId, cmd.ToId); err != nil {
		return err
	}

	return nil
}
