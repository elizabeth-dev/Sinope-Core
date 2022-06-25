package command

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type FollowProfile struct {
	FromId string
	ToId   string
}

type FollowProfileHandler struct {
	profileRepo profile.Repository
}

func NewFollowProfileHandler(profileRepo profile.Repository) FollowProfileHandler {
	if profileRepo == nil {
		panic("[command/follow_profile] nil repo")
	}

	return FollowProfileHandler{profileRepo}
}

func (h FollowProfileHandler) Handle(ctx context.Context, cmd FollowProfile) error {

	if err := h.profileRepo.AddFollower(ctx, cmd.FromId, cmd.ToId); err != nil {
		return err
	}

	return nil
}
