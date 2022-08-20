package main

import (
	"context"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/auth"
	server2 "github.com/elizabeth-dev/Sinope-Core/internal/pkg/server"
	"google.golang.org/grpc"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/ports"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/service"
	"github.com/elizabeth-dev/Sinope-Core/pkg/api"
)

func main() {
	ctx := context.Background()

	app := service.NewApplication(ctx)
	authMiddleware := auth.NewFireAuthMiddleware(ctx)

	go func() {
		server2.RunGraphQLServer(authMiddleware, func() *handler.Server {
			return ports.NewGraphQLServer(app)
		})
	}()

	server2.RunGRPCServer(authMiddleware, func(server *grpc.Server) {
		svc := ports.NewGrpcServer(app)
		api.RegisterProfileServiceServer(server, svc)
		api.RegisterQuestionServiceServer(server, svc)
	})
}
