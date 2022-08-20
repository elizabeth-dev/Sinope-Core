package query

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type GetProfileByTagHandler struct {
	readModel GetProfileByTagReadModel
}

type GetProfileByTagReadModel interface {
	GetProfileByTag(ctx context.Context, tag string) (*profile.Profile, error)
}

func NewGetProfileByTagHandler(readModel GetProfileByTagReadModel) GetProfileByTagHandler {
	if readModel == nil {
		panic("nil readModel")
	}
	return GetProfileByTagHandler{readModel}
}

func (h GetProfileByTagHandler) Handle(ctx context.Context, tag string) (pl *Profile, err error) {
	p, err := h.readModel.GetProfileByTag(ctx, tag)

	if err != nil {
		return nil, err
	}

	return &Profile{
		Id:          p.Id(),
		Tag:         p.Tag(),
		Name:        p.Name(),
		Avatar:      p.Avatar(),
		Description: p.Description(),
		CreatedAt:   p.CreatedAt(),
		Users:       p.Users(),
		Followers:   p.Followers(),
		Following:   p.Following(),
	}, nil
}
