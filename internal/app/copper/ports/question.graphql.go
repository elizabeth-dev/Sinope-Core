package ports

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/command"
	graphql1 "github.com/elizabeth-dev/Sinope-Core/internal/pkg/graphql"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/graphql/model"
	"github.com/google/uuid"
)

// SendQuestion is the resolver for the sendQuestion field.
func (r *mutationResolver) SendQuestion(ctx context.Context, input model.NewQuestion) (bool, error) {
	cmd := command.CreateQuestion{
		Id:        uuid.NewString(),
		Recipient: input.RecipientID,
		Content:   input.Content,
	}

	err := r.app.Commands.CreateQuestion.Handle(ctx, cmd)

	if err != nil {
		return false, err
	}

	return true, nil
}

// Mutation returns graphql1.MutationResolver implementation.
func (r *Resolver) Mutation() graphql1.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
