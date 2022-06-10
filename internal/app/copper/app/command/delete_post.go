package command

import (
	"context"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/post"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type DeletePost struct {
	Id       string
	FromUser string
}

type DeletePostHandler struct {
	profileRepo profile.Repository
	postRepo    post.Repository
}

func NewDeletePostHandler(
	profileRepo profile.Repository,
	postRepo post.Repository,
) DeletePostHandler {
	if profileRepo == nil {
		panic("[command/delete_post] nil profileRepo")
	}

	if postRepo == nil {
		panic("[command/delete_post] nil postRepo")
	}

	return DeletePostHandler{profileRepo, postRepo}
}

func (h DeletePostHandler) Handle(ctx context.Context, cmd DeletePost) error {
	// Get post to delete
	p, err := h.postRepo.GetPost(ctx, cmd.Id)

	// Check user permissions for profile
	pr, err := h.profileRepo.GetProfile(ctx, p.AuthorId())

	if err != nil {
		return err
	}

	if !pr.CheckUserOwnership(cmd.FromUser) {
		return profile.UnauthorizedError{ProfileID: pr.Id(), UserID: cmd.FromUser}
	}

	// Remove post from DB
	if err := h.postRepo.DeletePost(ctx, cmd.Id); err != nil {
		return err
	}

	// TODO: in the future, removing a post should check if it has a question associated

	return nil
}
