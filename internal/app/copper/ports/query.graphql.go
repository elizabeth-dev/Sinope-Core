package ports

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"firebase.google.com/go/v4/auth"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"
	graphql1 "github.com/elizabeth-dev/Sinope-Core/internal/pkg/graphql"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/graphql/model"
)

// Questions is the resolver for the questions field.
func (r *queryResolver) Questions(ctx context.Context, recipient string) ([]*model.Question, error) {
	userId := ctx.Value(common.AuthTokenInfoKey).(*auth.Token).Subject

	qs, err := r.app.Queries.GetProfileQuestions.Handle(
		ctx,
		recipient,
		userId,
	)

	if err != nil {
		return nil, err
	}

	var res []*model.Question
	for _, q := range qs {
		res = append(res, &model.Question{
			ID:          q.Id,
			RecipientID: q.Recipient,
			Content:     q.Content,
			CreatedAt:   q.CreatedAt,
		})
	}

	return res, nil
}

// Profile is the resolver for the profile field.
func (r *queryResolver) Profile(ctx context.Context, tag string) (*model.Profile, error) {
	pr, err := r.app.Queries.GetProfileByTag.Handle(ctx, tag)

	if err != nil {
		return nil, err
	}

	return &model.Profile{ID: pr.Id, Avatar: pr.Avatar, Name: pr.Name, Tag: pr.Tag}, nil
}

// Query returns graphql1.QueryResolver implementation.
func (r *Resolver) Query() graphql1.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
