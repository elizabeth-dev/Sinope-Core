package auth

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"
	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type FireAuthGrpcMiddleware struct {
	authClient *auth.Client
}

func NewFireAuthGrpcMiddleware(ctx context.Context) FireAuthGrpcMiddleware {
	app, err := firebase.NewApp(ctx, nil)

	if err != nil {
		log.Fatalf("error initializing firebase SDK: %v\n", err)
	}

	auth, err := app.Auth(ctx)

	if err != nil {
		log.Fatalf("error initializing firebase auth: %v\n", err)
	}

	return FireAuthGrpcMiddleware{
		authClient: auth,
	}
}

func (m FireAuthGrpcMiddleware) AuthFunc(ctx context.Context) (context.Context, error) {

	token, err := grpc_auth.AuthFromMD(ctx, "bearer")
	if err != nil {
		return nil, err
	}

	tokenInfo, err := m.authClient.VerifyIDToken(ctx, token)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "invalid auth token: %v", err)
	}

	// grpc_ctxtags.Extract(ctx).Set("auth.sub", userClaimFromToken(tokenInfo))

	newCtx := context.WithValue(ctx, common.AuthTokenInfoKey, tokenInfo)

	return newCtx, nil
}
