package ports

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"firebase.google.com/go/v4/auth"
	"fmt"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/command"
	graphql1 "github.com/elizabeth-dev/Sinope-Core/internal/pkg/graphql"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/graphql/model"
	"github.com/google/uuid"
)

// SendQuestion is the resolver for the sendQuestion field.
func (r *mutationResolver) SendQuestion(ctx context.Context, content string, recipientID string) (bool, error) {
	cmd := command.CreateQuestion{
		Id:        uuid.NewString(),
		Recipient: recipientID,
		Content:   content,
	}

	err := r.app.Commands.CreateQuestion.Handle(ctx, cmd)

	if err != nil {
		return false, err
	}

	return true, nil
}

// CreateProfile is the resolver for the createProfile field.
func (r *mutationResolver) CreateProfile(ctx context.Context, name string, tag string, description string) (*model.Profile, error) {
	token := ctx.Value(common.AuthTokenInfoKey)

	if token == nil {
		return nil, fmt.Errorf("unauthenticated")
	}

	userId := token.(*auth.Token).Subject
	id := uuid.NewString()

	cmd := command.CreateProfile{
		Id:          id,
		Tag:         tag,
		Name:        name,
		Description: description,
		Users:       []string{userId},
	}

	err := r.app.Commands.CreateProfile.Handle(ctx, cmd)

	if err != nil {
		return nil, err
	}

	pr, err := r.app.Queries.GetProfile.Handle(ctx, id)

	if err != nil {
		return nil, fmt.Errorf("profile not found")
	}

	return &model.Profile{
		ID:     pr.Id,
		Tag:    pr.Tag,
		Name:   pr.Name,
		Avatar: pr.Avatar,
	}, nil
}

// Mutation returns graphql1.MutationResolver implementation.
func (r *Resolver) Mutation() graphql1.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
