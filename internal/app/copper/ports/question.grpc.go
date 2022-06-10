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
)

func (g GrpcServer) GetQuestion(
	ctx context.Context,
	req *api.GetQuestionReq,
) (*api.Question, error) {
	q, err := g.app.Queries.GetQuestion.Handle(ctx, req.Id)

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &api.Question{
		Id:          q.Id,
		SenderId:    q.Sender,
		RecipientId: q.Recipient,
		Content:     q.Content,
		Anonymous:   q.Anonymous,
		CreatedAt:   uint64(q.CreatedAt.Unix()),
	}, nil
}

func (g GrpcServer) GetProfileQuestions(
	req *api.GetProfileQuestionsReq,
	srv api.QuestionService_GetProfileQuestionsServer,
) error {
	userId := srv.Context().Value(common.AuthTokenInfoKey).(*auth.Token).Subject

	qs, err := g.app.Queries.GetProfileQuestions.Handle(
		srv.Context(),
		req.ProfileId,
		userId,
	) // TODO: I think passing an array to gRPC stream can be optimized

	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}

	for _, q := range qs {
		if err := srv.Send(&api.Question{
			Id:          q.Id,
			SenderId:    q.Sender,
			RecipientId: q.Recipient,
			Content:     q.Content,
			Anonymous:   q.Anonymous,
			CreatedAt:   uint64(q.CreatedAt.Unix()),
		}); err != nil {
			return err
		}
	}

	return nil
}

func (g GrpcServer) CreateQuestion(
	ctx context.Context,
	req *api.CreateQuestionReq,
) (*emptypb.Empty, error) {
	userId := ctx.Value(common.AuthTokenInfoKey).(*auth.Token).Subject

	cmd := command.CreateQuestion{
		Id:        uuid.NewString(),
		Sender:    req.Sender,
		Recipient: req.Recipient,
		Content:   req.Content,
		Anonymous: req.Anonymous,
		FromUser:  userId,
	}

	err := g.app.Commands.CreateQuestion.Handle(ctx, cmd)

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &emptypb.Empty{}, nil
}

func (g GrpcServer) DeleteQuestion(
	ctx context.Context,
	req *api.DeleteQuestionReq,
) (*emptypb.Empty, error) {
	userId := ctx.Value(common.AuthTokenInfoKey).(*auth.Token).Subject

	cmd := command.DeleteQuestion{
		Id:       req.Id,
		FromUser: userId,
	}

	err := g.app.Commands.DeleteQuestion.Handle(ctx, cmd)

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &emptypb.Empty{}, nil
}
