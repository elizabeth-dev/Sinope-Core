package auth

import (
	"context"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"
	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (m FireAuthMiddleware) GRPC(ctx context.Context) (context.Context, error) {

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
