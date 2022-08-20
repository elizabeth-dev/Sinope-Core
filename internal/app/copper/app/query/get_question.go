package query

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/question"
)

type GetQuestionHandler struct {
	readModel GetQuestionReadModel
}

type GetQuestionReadModel interface {
	GetQuestion(ctx context.Context, questionId string) (*question.Question, error)
}

func NewGetQuestionHandler(readModel GetQuestionReadModel) GetQuestionHandler {
	if readModel == nil {
		panic("nil readModel")
	}
	return GetQuestionHandler{readModel}
}

func (h GetQuestionHandler) Handle(
	ctx context.Context,
	questionId string,
) (*Question, error) {
	q, err := h.readModel.GetQuestion(ctx, questionId)

	if err != nil {
		return nil, err
	}

	return &Question{
		Id:        q.Id(),
		Recipient: q.Recipient(),
		Content:   q.Content(),
		CreatedAt: q.CreatedAt(),
	}, nil
}
