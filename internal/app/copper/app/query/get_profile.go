package query

import (
	"context"
)

type GetProfileHandler struct {
	readModel GetProfileReadModel
}

type GetProfileReadModel interface {
	GetProfile(ctx context.Context, profileId string) (*Profile, error)
}

func NewGetProfileHandler(readModel GetProfileReadModel) GetProfileHandler {
	if readModel == nil {
		panic("nil readModel")
	}
	return GetProfileHandler{readModel}
}

func (h GetProfileHandler) Handle(ctx context.Context, profileId string) (pl *Profile, err error) {
	return h.readModel.GetProfile(ctx, profileId)
}
