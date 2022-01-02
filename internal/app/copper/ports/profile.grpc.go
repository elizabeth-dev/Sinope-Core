package ports

import (
	"context"
	"log"

	"firebase.google.com/go/v4/auth"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/command"
	"github.com/elizabeth-dev/Sinope-Core/internal/pkg/common"
	"github.com/elizabeth-dev/Sinope-Core/pkg/api"
	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (g GrpcServer) GetProfile(
	ctx context.Context,
	req *api.GetProfileReq,
) (*api.ProfileRes, error) {
	pr, err := g.app.Queries.GetProfile.Handle(ctx, req.Id)

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &api.ProfileRes{
		Id:          pr.Id,
		Tag:         pr.Tag,
		Name:        pr.Name,
		Description: pr.Description,
		CreatedAt:   uint64(pr.CreatedAt.Unix()),
		User:        pr.Users,
	}, nil
}

func (g GrpcServer) DeleteProfile(
	_ context.Context,
	_ *api.DeleteProfileReq,
) (*emptypb.Empty, error) {
	panic("not implemented") // TODO: Implement
}

func (g GrpcServer) UpdateProfile(
	_ context.Context,
	_ *api.UpdateProfileReq,
) (*api.ProfileRes, error) {
	panic("not implemented") // TODO: Implement
}

func (g GrpcServer) CreateProfile(
	ctx context.Context,
	req *api.CreateProfileReq,
) (*api.ProfileRes, error) {
	newId := uuid.NewString()

	cmd := command.CreateProfile{
		Id:          newId,
		Tag:         req.Tag,
		Name:        req.Name,
		Description: req.Description,
		Users:       []string{ctx.Value(common.AuthTokenInfoKey).(*auth.Token).Subject},
	}

	err := g.app.Commands.CreateProfile.Handle(ctx, cmd)
	if err != nil {
		log.Printf("[GrpcServer] CreateProfile error: %v", err)
		return nil, status.Error(codes.Internal, err.Error())
	}

	pr, err := g.app.Queries.GetProfile.Handle(ctx, newId)

	if err != nil {
		log.Printf("[GrpcServer] CreateProfile error: %v", err)
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &api.ProfileRes{
		Id:          pr.Id,
		Tag:         pr.Tag,
		Name:        pr.Name,
		Description: pr.Description,
		CreatedAt:   uint64(pr.CreatedAt.Unix()),
		User:        pr.Users,
	}, nil
}
