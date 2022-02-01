package query

import (
	"context"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/post"
)

type GetPostHandler struct {
	readModel GetPostReadModel
}

type GetPostReadModel interface {
	GetPost(ctx context.Context, postId string) (*post.Post, error)
}

func NewGetPostHandler(readModel GetPostReadModel) GetPostHandler {
	if readModel == nil {
		panic("nil readModel")
	}
	return GetPostHandler{readModel}
}

func (h GetPostHandler) Handle(ctx context.Context, postId string) (pl *Post, err error) {
	p, err := h.readModel.GetPost(ctx, postId)

	if err != nil {
		return nil, err
	}

	return &Post{
		Id:        p.Id(),
		Content:   p.Content(),
		AuthorId:  p.AuthorId(),
		CreatedAt: p.CreatedAt(),
	}, nil
}
