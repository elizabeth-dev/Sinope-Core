package command

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/post"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type CreatePost struct {
	Id       string
	AuthorId string
	Content  string
	FromUser string
}

type CreatePostHandler struct {
	postRepo    post.Repository
	profileRepo profile.Repository
}

func NewCreatePostHandler(
	postRepo post.Repository,
	profileRepo profile.Repository,
) CreatePostHandler {
	if postRepo == nil {
		panic("[command/create_post] nil postRepo")
	}

	if profileRepo == nil {
		panic("[command/create_post] nil profileRepo")
	}

	return CreatePostHandler{postRepo, profileRepo}
}

func (h CreatePostHandler) Handle(ctx context.Context, cmd CreatePost) error {
	// Check user permissions for profile
	pr, err := h.profileRepo.GetProfile(ctx, cmd.AuthorId)

	if err != nil {
		return err
	}

	if !pr.CheckUserOwnership(cmd.FromUser) {
		return profile.UnauthorizedError{ProfileID: pr.Id(), UserID: cmd.FromUser}
	}

	// Generate new post
	qr, err := post.NewPost(cmd.Id, cmd.Content, cmd.AuthorId)
	if err != nil {
		return err
	}

	// Save post to DB
	if err := h.postRepo.CreatePost(ctx, qr); err != nil {
		return err
	}

	return nil
}
