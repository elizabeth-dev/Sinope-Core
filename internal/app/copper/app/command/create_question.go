package command

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/question"
)

type CreateQuestion struct {
	Id        string
	Sender    string
	Recipient string
	Content   string
	Anonymous bool
	FromUser  string
}

type CreateQuestionHandler struct {
	questionRepo question.Repository
	profileRepo  profile.Repository
}

func NewCreateQuestionHandler(
	questionRepo question.Repository,
	profileRepo profile.Repository,
) CreateQuestionHandler {
	if questionRepo == nil {
		panic("[command/create_question] nil questionRepo")
	}

	if profileRepo == nil {
		panic("[command/create_question] nil profileRepo")
	}

	return CreateQuestionHandler{questionRepo, profileRepo}
}

func (h CreateQuestionHandler) Handle(ctx context.Context, cmd CreateQuestion) error {
	// Check user permissions for profile
	p, err := h.profileRepo.GetProfile(ctx, cmd.Sender)

	if err != nil {
		return err
	}

	if !p.CheckUserOwnership(cmd.FromUser) {
		return profile.UnauthorizedError{ProfileID: p.Id(), UserID: cmd.FromUser}
	}

	// Generate new question
	qr, err := question.NewQuestion(cmd.Id, cmd.Sender, cmd.Recipient, cmd.Content, cmd.Anonymous)
	if err != nil {
		return err
	}

	// Save question to DB
	if err := h.questionRepo.CreateQuestion(ctx, qr); err != nil {
		return err
	}

	return nil
}
