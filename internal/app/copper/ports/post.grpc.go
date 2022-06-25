package ports

import (
	"context"
	"firebase.google.com/go/v4/auth"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/command"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"
	"github.com/elizabeth-dev/Sinope-Core/pkg/api"
	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	"log"
)

func (g GrpcServer) GetPost(ctx context.Context, req *api.GetPostReq) (*api.Post, error) {
	p, err := g.app.Queries.GetPost.Handle(ctx, req.Id)

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &api.Post{
		Id:        p.Id,
		Content:   p.Content,
		AuthorId:  p.AuthorId,
		CreatedAt: uint64(p.CreatedAt.Unix()),
	}, nil
}

func (g GrpcServer) DeletePost(ctx context.Context, req *api.DeletePostReq) (*emptypb.Empty, error) {
	userId := ctx.Value(common.AuthTokenInfoKey).(*auth.Token).Subject

	cmd := command.DeletePost{
		Id:       req.Id,
		FromUser: userId,
	}

	err := g.app.Commands.DeletePost.Handle(ctx, cmd)

	if err != nil {
		log.Printf("[GrpcServer] DeletePost error while deleting post: %v", err)
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &emptypb.Empty{}, nil
}

func (g GrpcServer) CreatePost(ctx context.Context, req *api.CreatePostReq) (*api.Post, error) {
	userId := ctx.Value(common.AuthTokenInfoKey).(*auth.Token).Subject

	newId := uuid.NewString()

	cmd := command.CreatePost{
		Id:       newId,
		Content:  req.Content,
		AuthorId: req.CurrentProfileId,
		FromUser: userId,
	}

	err := g.app.Commands.CreatePost.Handle(ctx, cmd)

	if err != nil {
		log.Printf("[GrpcServer] CreatePost error while saving new post: %v", err)
		return nil, status.Error(codes.Internal, err.Error())
	}

	p, err := g.app.Queries.GetPost.Handle(ctx, newId)

	if err != nil {
		log.Printf("[GrpcServer] CreatePost error while retrieving new post: %v", err)
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &api.Post{
		Id:        p.Id,
		Content:   p.Content,
		CreatedAt: uint64(p.CreatedAt.Unix()),
		AuthorId:  p.AuthorId,
	}, nil
}

func (g GrpcServer) GetProfilePosts(req *api.GetProfilePostsReq, srv api.PostService_GetProfilePostsServer) error {
	ps, err := g.app.Queries.GetProfilePosts.Handle(
		srv.Context(),
		req.ProfileId,
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
