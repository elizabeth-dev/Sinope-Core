package server

import (
	"fmt"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/auth"
	"log"
	"net/http"
	"os"
)

func RunGraphQLServer(authMiddleware auth.FireAuthMiddleware, registerServer func() *handler.Server) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	addr := fmt.Sprintf(":%s", port)
	RunGraphQLServerOnAddr(addr, authMiddleware, registerServer)
}

func RunGraphQLServerOnAddr(addr string, authMiddleware auth.FireAuthMiddleware, registerServer func() *handler.Server) {
	srv := registerServer()

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", authMiddleware.GraphQL(srv))

	log.Printf("Starting: GraphQL Listener")
	log.Fatal(http.ListenAndServe(addr, nil))
}
