package ports

import (
	"context"
	"log"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app"
	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/app/command"
	"github.com/elizabeth-dev/Sinope-Core/pkg/api"
	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GrpcServer struct {
	app app.Application
	api.UnimplementedProfileServiceServer
}

func NewGrpcServer(application app.Application) GrpcServer {
	return GrpcServer{app: application}
}

func (g GrpcServer) GetProfile(
	ctx context.Context,
	req *api.GetProfileReq,
) (*api.ProfileRes, error) {
	pr, err := g.app.Queries.GetProfile.Handle(ctx, req.Id)

	//if err return grpc status error
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	// return api.ProfileRes with values from profile
	return &api.ProfileRes{
		Id:          pr.Id,
		Tag:         pr.Tag,
		Name:        pr.Name,
		Description: pr.Description,
		CreatedAt:   uint64(pr.CreatedAt.Unix()),
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
	}

	err := g.app.Commands.CreateProfile.Handle(ctx, cmd)
	if err != nil {
		log.Printf("[GrpcServer] CreateProfile error: %v", err)
		return nil, status.Error(codes.Internal, err.Error())
	}

	pr, err := g.app.Queries.GetProfile.Handle(ctx, newId)

	// if err return grpc status error
	if err != nil {
		log.Printf("[GrpcServer] CreateProfile error: %v", err)
		return nil, status.Error(codes.Internal, err.Error())
	}

	// return api.ProfileRes with values from profile
	return &api.ProfileRes{
		Id:          pr.Id,
		Tag:         pr.Tag,
		Name:        pr.Name,
		Description: pr.Description,
		CreatedAt:   uint64(pr.CreatedAt.Unix()),
	}, nil
}
