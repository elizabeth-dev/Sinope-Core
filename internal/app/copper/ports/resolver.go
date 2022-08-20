package ports

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/graphql"
)

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	app app.Application
}

func NewGraphQLServer(application app.Application) *handler.Server {
	return handler.NewDefaultServer(
		graphql.NewExecutableSchema(
			graphql.Config{
				Resolvers: &Resolver{app: application},
			},
		),
	)
}
