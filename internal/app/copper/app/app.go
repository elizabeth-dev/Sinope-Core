package app

import (
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/command"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/query"
)

type Application struct {
	Commands Commands
	Queries  Queries
}

type Commands struct {
	CreateProfile   command.CreateProfileHandler
	CreateQuestion  command.CreateQuestionHandler
	DeleteQuestion  command.DeleteQuestionHandler
	DeletePost      command.DeletePostHandler
	CreatePost      command.CreatePostHandler
	FollowProfile   command.FollowProfileHandler
	UnfollowProfile command.UnfollowProfileHandler
}

type Queries struct {
	GetProfile          query.GetProfileHandler
	GetQuestion         query.GetQuestionHandler
	GetProfileQuestions query.GetProfileQuestionsHandler
	GetPost             query.GetPostHandler
	GetTimeline         query.GetTimelineHandler
	GetProfilePosts     query.GetProfilePostsHandler
}
