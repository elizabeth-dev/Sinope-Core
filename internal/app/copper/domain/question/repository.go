package question

import (
	"context"
	"fmt"
)

type NotFoundError struct {
	QuestionID string
}

func (e NotFoundError) Error() string {
	return fmt.Sprintf("question '%s' not found", e.QuestionID)
}

type Repository interface {
	GetQuestion(ctx context.Context, questionId string) (*Question, error)
	DeleteQuestion(ctx context.Context, questionId string) error
	CreateQuestion(ctx context.Context, q *Question) error
}
