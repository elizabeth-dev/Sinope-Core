package auth

import (
	"context"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"
	"net/http"
)

func (m FireAuthMiddleware) GraphQL(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie("auth-cookie")

		if err != nil || c == nil {
			next.ServeHTTP(w, r)
			return
		}

		tokenInfo, err := m.authClient.VerifyIDToken(r.Context(), c.Value)
		if err != nil {
			http.Error(w, "Invalid cookie", http.StatusForbidden)
			return
		}

		ctx := context.WithValue(r.Context(), common.AuthTokenInfoKey, tokenInfo)

		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
