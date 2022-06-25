package query

import (
	"context"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/post"
)

type GetProfilePostsHandler struct {
	readModel GetProfilePostsReadModel
}

type GetProfilePostsReadModel interface {
	GetPostsByProfile(ctx context.Context, profileId string) ([]*post.Post, error)
}

func NewGetProfilePostsHandler(
	readModel GetProfilePostsReadModel,
) GetProfilePostsHandler {
	if readModel == nil {
		panic("nil readModel")
	}

	return GetProfilePostsHandler{readModel}
}

func (h GetProfilePostsHandler) Handle(
	ctx context.Context,
	profileId string,
) ([]*Post, error) {
	// Get questions from DB
	ps, err := h.readModel.GetPostsByProfile(ctx, profileId)

	if err != nil {
		return nil, err
	}

	// Convert to domain model
	var posts []*Post
	for _, p := range ps {
		posts = append(posts, &Post{
			Id:        p.Id(),
			Content:   p.Content(),
			AuthorId:  p.AuthorId(),
			CreatedAt: p.CreatedAt(),
		})
	}

	return posts, nil
}
