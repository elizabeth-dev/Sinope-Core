package server

import (
	"fmt"
	"log"
	"net"
	"os"

	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/auth"
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	grpc_ctxtags "github.com/grpc-ecosystem/go-grpc-middleware/tags"
	"google.golang.org/grpc"
)

func RunGRPCServer(authMiddleware auth.FireAuthMiddleware, registerServer func(server *grpc.Server)) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := fmt.Sprintf(":%s", port)
	RunGRPCServerOnAddr(addr, authMiddleware, registerServer)
}

func RunGRPCServerOnAddr(addr string, authMiddleware auth.FireAuthMiddleware, registerServer func(server *grpc.Server)) {
	grpcServer := grpc.NewServer(
		grpc_middleware.WithUnaryServerChain(
			grpc_ctxtags.UnaryServerInterceptor(
				grpc_ctxtags.WithFieldExtractor(grpc_ctxtags.CodeGenRequestFieldExtractor),
			),
			grpc_auth.UnaryServerInterceptor(authMiddleware.GRPC),
		),
		grpc_middleware.WithStreamServerChain(
			grpc_ctxtags.StreamServerInterceptor(
				grpc_ctxtags.WithFieldExtractor(grpc_ctxtags.CodeGenRequestFieldExtractor),
			),
			grpc_auth.StreamServerInterceptor(authMiddleware.GRPC),
		),
	)
	registerServer(grpcServer)

	listen, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Starting: gRPC Listener")
	log.Fatal(grpcServer.Serve(listen))
}
