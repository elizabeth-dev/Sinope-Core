package ports

import (
	"firebase.google.com/go/v4/auth"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"
	"github.com/elizabeth-dev/Sinope-Core/pkg/api"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (g GrpcServer) GetTimeline(req *api.GetTimelineReq, srv api.TimelineService_GetTimelineServer) error {
	userId := srv.Context().Value(common.AuthTokenInfoKey).(*auth.Token).Subject

	ps, err := g.app.Queries.GetTimeline.Handle(
		srv.Context(),
		req.ProfileId,
		userId,
	) // TODO: I think passing an array to gRPC stream can be optimized

	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}

	for _, p := range ps {
		if err := srv.Send(&api.Post{
			Id:        p.Id,
			Content:   p.Content,
			AuthorId:  p.AuthorId,
			CreatedAt: uint64(p.CreatedAt.Unix()),
		}); err != nil {
			return err
		}
	}

	return nil
}
