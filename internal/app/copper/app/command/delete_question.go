package command

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/question"
)

type DeleteQuestion struct {
	Id       string
	FromUser string
}

type DeleteQuestionHandler struct {
	questionRepo question.Repository
	profileRepo  profile.Repository
}

func NewDeleteQuestionHandler(
	questionRepo question.Repository,
	profileRepo profile.Repository,
) DeleteQuestionHandler {
	if questionRepo == nil {
		panic("[command/delete_question] nil questionRepo")
	}

	if profileRepo == nil {
		panic("[command/delete_question] nil profileRepo")
	}

	return DeleteQuestionHandler{questionRepo, profileRepo}
}

func (h DeleteQuestionHandler) Handle(ctx context.Context, cmd DeleteQuestion) error {
	// Get question to delete
	q, err := h.questionRepo.GetQuestion(ctx, cmd.Id)

	// Check user permissions for profile
	p, err := h.profileRepo.GetProfile(ctx, q.Recipient())

	if err != nil {
		return err
	}

	if !p.CheckUserOwnership(cmd.FromUser) {
		return profile.UnauthorizedError{ProfileID: p.Id(), UserID: cmd.FromUser}
	}

	// Remove question from DB
	if err := h.questionRepo.DeleteQuestion(ctx, cmd.Id); err != nil {
		return err
	}

	return nil
}
