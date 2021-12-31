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
	CreateProfile command.CreateProfileHandler
}

type Queries struct {
	GetProfile query.GetProfileHandler
}
