package auth

import (
	"context"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"log"
)

type FireAuthMiddleware struct {
	authClient *auth.Client
}

func NewFireAuthMiddleware(ctx context.Context) FireAuthMiddleware {
	app, err := firebase.NewApp(ctx, nil)

	if err != nil {
		log.Fatalf("error initializing firebase SDK: %v\n", err)
	}

	authClient, err := app.Auth(ctx)

	if err != nil {
		log.Fatalf("error initializing firebase auth: %v\n", err)
	}

	return FireAuthMiddleware{
		authClient: authClient,
	}
}
