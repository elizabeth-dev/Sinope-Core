package query

import (
	"context"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/post"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type GetTimelineHandler struct {
	readModel GetTimelineReadModel
}

type GetTimelineReadModel interface {
	GetPostsByProfile(ctx context.Context, profileId string) ([]*post.Post, error)
	GetProfile(ctx context.Context, profileId string) (*profile.Profile, error)
}

func NewGetTimelineHandler(
	readModel GetTimelineReadModel,
) GetTimelineHandler {
	if readModel == nil {
		panic("nil readModel")
	}

	return GetTimelineHandler{readModel}
}

func (h GetTimelineHandler) Handle(
	ctx context.Context,
	profileId string,
	userId string,
) ([]*Post, error) {
	// Check ownership of profile
	p, err := h.readModel.GetProfile(ctx, profileId)

	if err != nil {
		return nil, err
	}

	if !p.CheckUserOwnership(userId) {
		return nil, profile.UnauthorizedError{ProfileID: p.Id(), UserID: userId}
	}

	var posts []*Post
	for _, f := range p.Following() {
		ps, err := h.readModel.GetPostsByProfile(ctx, f)

		if err != nil {
			return nil, err
		}

		// Convert to domain model
		for _, p := range ps {
			posts = append(posts, &Post{
				Id:        p.Id(),
				Content:   p.Content(),
				AuthorId:  p.AuthorId(),
				CreatedAt: p.CreatedAt(),
			})
		}
	}

	return posts, nil
}
