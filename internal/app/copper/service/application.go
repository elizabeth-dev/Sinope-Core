package service

import (
	"context"
	"log"
	"net/url"
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
	dbClient := setupMongo(ctx)
	profileRepo := adapter.NewProfileRepository(dbClient)
	questionRepo := adapter.NewQuestionRepository(dbClient)
	postRepo := adapter.NewPostRepository(dbClient)

	return app.Application{
		Queries: app.Queries{
			GetProfile:  query.NewGetProfileHandler(profileRepo),
			GetQuestion: query.NewGetQuestionHandler(questionRepo),
			GetProfileQuestions: query.NewGetProfileQuestionsHandler(struct {
				adapter.ProfileRepository
				adapter.QuestionRepository
			}{profileRepo, questionRepo}),
			GetPost: query.NewGetPostHandler(postRepo),
			GetTimeline: query.NewGetTimelineHandler(struct {
				adapter.ProfileRepository
				adapter.PostRepository
			}{profileRepo, postRepo}),
		},
		Commands: app.Commands{
			CreateProfile:   command.NewCreateProfileHandler(profileRepo),
			CreateQuestion:  command.NewCreateQuestionHandler(questionRepo, profileRepo),
			DeleteQuestion:  command.NewDeleteQuestionHandler(questionRepo, profileRepo),
			DeletePost:      command.NewDeletePostHandler(profileRepo, postRepo),
			CreatePost:      command.NewCreatePostHandler(postRepo, profileRepo),
			FollowProfile:   command.NewFollowProfileHandler(profileRepo),
			UnfollowProfile: command.NewUnfollowProfileHandler(profileRepo),
		},
	}
}

func setupMongo(ctx context.Context) *mongo.Database {
	mongoUri := os.Getenv("MONGODB_URI")

	if mongoUri == "" {
		log.Fatal(
			"You must set your 'MONGODB_URI' environmental variable.",
		)
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))

	if err != nil {
		panic(err)
	}

	_mongoUri, err := url.Parse(mongoUri)

	var db string

	if err == nil {
		db = _mongoUri.Path[1:]
	}

	if db == "" {
		db = os.Getenv("MONGODB_DB")
	}

	if db == "" {
		log.Fatal(
			"You must set your db on the MongoDB URI or in the 'MONGODB_DB' environmental variable.",
		)
	}

	return client.Database(db)
}
