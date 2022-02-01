package post

import (
	"context"
	"fmt"
)

type NotFoundError struct {
	PostID string
}

func (e NotFoundError) Error() string {
	return fmt.Sprintf("post '%s' not found", e.PostID)
}

type UnauthorizedError struct {
	PostID string
	UserID string
}

func (e UnauthorizedError) Error() string {
	return fmt.Sprintf(
		"user '%s' is not authorized to perform operations for post '%s'",
		e.UserID,
		e.PostID,
	)
}

type Repository interface {
	GetPost(ctx context.Context, postId string) (*Post, error)
	CreatePost(ctx context.Context, pr *Post) error
	DeletePost(ctx context.Context, postId string) error
}
