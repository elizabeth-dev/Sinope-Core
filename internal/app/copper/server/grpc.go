package server

import (
	"fmt"
	"log"
	"net"
	"os"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_ctxtags "github.com/grpc-ecosystem/go-grpc-middleware/tags"
	"google.golang.org/grpc"
)

func RunGRPCServer(registerServer func(server *grpc.Server)) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := fmt.Sprintf(":%s", port)
	RunGRPCServerOnAddr(addr, registerServer)
}

func RunGRPCServerOnAddr(addr string, registerServer func(server *grpc.Server)) {
	grpcServer := grpc.NewServer(
		grpc_middleware.WithUnaryServerChain(
			grpc_ctxtags.UnaryServerInterceptor(
				grpc_ctxtags.WithFieldExtractor(grpc_ctxtags.CodeGenRequestFieldExtractor),
			),
		),
		grpc_middleware.WithStreamServerChain(
			grpc_ctxtags.StreamServerInterceptor(
				grpc_ctxtags.WithFieldExtractor(grpc_ctxtags.CodeGenRequestFieldExtractor),
			),
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
