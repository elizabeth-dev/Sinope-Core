package query

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/question"
)

type GetProfileQuestionsHandler struct {
	readModel GetProfileQuestionsReadModel
}

type GetProfileQuestionsReadModel interface {
	GetQuestionsByProfile(ctx context.Context, profileId string) ([]*question.Question, error)
	GetProfile(ctx context.Context, profileId string) (*profile.Profile, error)
}

func NewGetProfileQuestionsHandler(
	readModel GetProfileQuestionsReadModel,
) GetProfileQuestionsHandler {
	if readModel == nil {
		panic("nil readModel")
	}

	return GetProfileQuestionsHandler{readModel}
}

func (h GetProfileQuestionsHandler) Handle(
	ctx context.Context,
	profileId string,
	userId string,
) ([]*Question, error) {
	// Check ownership of profile
	p, err := h.readModel.GetProfile(ctx, profileId)

	if err != nil {
		return nil, err
	}

	if !p.CheckUserOwnership(userId) {
		return nil, profile.UnauthorizedError{ProfileID: p.Id(), UserID: userId}
	}

	// Get questions from DB
	q, err := h.readModel.GetQuestionsByProfile(ctx, profileId)

	if err != nil {
		return nil, err
	}

	// Convert to domain model
	var qs []*Question
	for _, q := range q {
		qs = append(qs, &Question{
			Id:        q.Id(),
			Sender:    q.Sender(),
			Recipient: q.Recipient(),
			Content:   q.Content(),
			Anonymous: q.Anonymous(),
			CreatedAt: q.CreatedAt(),
		})
	}

	return qs, nil
}
