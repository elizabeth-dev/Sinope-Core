package main

import (
	"context"

	"google.golang.org/grpc"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/ports"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/server"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/service"
	"github.com/elizabeth-dev/Sinope-Core/pkg/api"
)

func main() {
	ctx := context.Background()

	app := service.NewApplication(ctx)

	server.RunGRPCServer(func(server *grpc.Server) {
		svc := ports.NewGrpcServer(app)
		api.RegisterProfileServiceServer(server, svc)
		api.RegisterQuestionServiceServer(server, svc)
	})
}
