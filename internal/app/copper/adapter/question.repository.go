package adapter

import (
	"context"
	"time"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/question"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type QuestionModel struct {
	Id        string    `bson:"id"`
	Recipient string    `bson:"recipient"`
	Content   string    `bson:"content"`
	CreatedAt time.Time `bson:"created_at"`
}

type QuestionRepository struct {
	col *mongo.Collection
}

func NewQuestionRepository(dbClient *mongo.Database) QuestionRepository {
	if dbClient == nil {
		panic("[QuestionRepository] missing dbClient")
	}

	return QuestionRepository{col: dbClient.Collection("question")}
}

func (r QuestionRepository) GetQuestion(
	ctx context.Context,
	id string,
) (*question.Question, error) {
	var questionModel QuestionModel

	err := r.col.FindOne(ctx, bson.D{{Key: "id", Value: id}}).Decode(&questionModel)

	if err != nil {
		return nil, errors.Wrap(err, "[QuestionRepository] Error retrieving question "+id)
	}

	q, err := question.UnmarshalQuestionFromDB(
		questionModel.Id,
		questionModel.Recipient,
		questionModel.Content,
		questionModel.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return q, nil
}

func (r QuestionRepository) GetQuestionsByProfile(
	ctx context.Context,
	profileId string,
) ([]*question.Question, error) {
	var questions []QuestionModel
	cursor, err := r.col.Find(ctx, bson.D{{Key: "recipient", Value: profileId}})

	if err != nil {
		return nil, errors.Wrap(err, "[QuestionRepository] Error retrieving questions")
	}

	if err := cursor.All(ctx, &questions); err != nil {
		return nil, errors.Wrap(err, "[QuestionRepository] Error parsing questions")
	}

	var qs []*question.Question
	for _, q := range questions {
		q, err := question.UnmarshalQuestionFromDB(
			q.Id,
			q.Recipient,
			q.Content,
			q.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		qs = append(qs, q)
	}

	return qs, nil
}

func (r QuestionRepository) CreateQuestion(ctx context.Context, q *question.Question) error {
	questionModel := r.marshalQuestion(q)

	if _, err := r.col.InsertOne(ctx, questionModel); err != nil {
		return errors.Wrap(err, "[QuestionRepository] Error creating question")
	}

	return nil
}

func (r QuestionRepository) DeleteQuestion(ctx context.Context, id string) error {
	if _, err := r.col.DeleteOne(ctx, bson.D{{Key: "id", Value: id}}); err != nil {
		return errors.Wrap(err, "[QuestionRepository] Error removing question")
	}

	return nil
}

func (r QuestionRepository) marshalQuestion(q *question.Question) QuestionModel {
	return QuestionModel{
		Id:        q.Id(),
		Recipient: q.Recipient(),
		Content:   q.Content(),
		CreatedAt: q.CreatedAt(),
	}
}
