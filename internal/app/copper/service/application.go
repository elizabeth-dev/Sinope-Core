package service

import (
	"context"
	"log"
	"os"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/adapter"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/command"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/query"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewApplication(ctx context.Context) app.Application {
	return newApplication(ctx)
}

func newApplication(ctx context.Context) app.Application {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal(
			"You must set your 'MONGODB_URI' environmental variable.",
		)
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

	if err != nil {
		panic(err)
	}

	/* defer func() {
		if err := client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}() */

	db := os.Getenv("MONGODB_DB")
	if db == "" {
		log.Fatal(
			"You must set your 'MONGODB_DB' environmental variable.",
		)
	}

	profileRepository := adapter.NewProfileRepository(client.Database(db))

	return app.Application{
		Queries: app.Queries{
			GetProfile: query.NewGetProfileHandler(profileRepository),
		},
		Commands: app.Commands{
			CreateProfile: command.NewCreateProfileHandler(profileRepository),
		},
	}
}
