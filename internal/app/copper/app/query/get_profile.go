package query

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
)

type GetProfileHandler struct {
	readModel GetProfileReadModel
}

type GetProfileReadModel interface {
	GetProfile(ctx context.Context, profileId string) (*profile.Profile, error)
}

func NewGetProfileHandler(readModel GetProfileReadModel) GetProfileHandler {
	if readModel == nil {
		panic("nil readModel")
	}
	return GetProfileHandler{readModel}
}

func (h GetProfileHandler) Handle(ctx context.Context, profileId string) (pl *Profile, err error) {
	p, err := h.readModel.GetProfile(ctx, profileId)

	if err != nil {
		return nil, err
	}

	return &Profile{
		Id:          p.Id(),
		Tag:         p.Tag(),
		Name:        p.Name(),
		Description: p.Description(),
		CreatedAt:   p.CreatedAt(),
		Users:       p.Users(),
	}, nil
}
