package ports

import (
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app"
	"github.com/elizabeth-dev/Sinope-Core/pkg/api"
)

type GrpcServer struct {
	app app.Application
	api.UnimplementedProfileServiceServer
	api.UnimplementedQuestionServiceServer
}

func NewGrpcServer(application app.Application) GrpcServer {
	return GrpcServer{app: application}
}
