package adapter

import (
	"context"
	"time"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/post"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type PostModel struct {
	Id        string    `bson:"id"`
	Content   string    `bson:"content"`
	AuthorId  string    `bson:"author_id"`
	CreatedAt time.Time `bson:"created_at"`
}

type PostRepository struct {
	col *mongo.Collection
}

func NewPostRepository(dbClient *mongo.Database) PostRepository {
	if dbClient == nil {
		panic("[PostRepository] missing dbClient")
	}

	return PostRepository{col: dbClient.Collection("post")}
}

func (r PostRepository) GetPost(
	ctx context.Context,
	postId string,
) (*post.Post, error) {
	var postModel PostModel

	err := r.col.FindOne(ctx, bson.D{{Key: "id", Value: postId}}).Decode(&postModel)

	if err != nil {
		return nil, errors.Wrap(err, "[PostRepository] Error retrieving post "+postId)
	}

	p, err := post.UnmarshalPostFromDB(
		postModel.Id,
		postModel.Content,
		postModel.AuthorId,
		postModel.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r PostRepository) CreatePost(ctx context.Context, pr *post.Post) error {
	postModel := r.marshalPost(pr)

	if _, err := r.col.InsertOne(ctx, postModel); err != nil {
		return err
	}

	return nil
}

func (r PostRepository) DeletePost(ctx context.Context, postId string) error {
	if _, err := r.col.DeleteOne(ctx, bson.D{{Key: "id", Value: postId}}); err != nil {
		return err
	}

	return nil
}

func (r PostRepository) GetPostsByProfile(ctx context.Context, profileId string) ([]*post.Post, error) {
	var posts []PostModel

	cur, err := r.col.Find(ctx, bson.D{{Key: "author_id", Value: profileId}})

	if err != nil {
		return nil, errors.Wrap(err, "[PostRepository] Error retrieving posts for profile "+profileId)
	}

	if err := cur.All(ctx, &posts); err != nil {
		return nil, errors.Wrap(err, "[PostRepository] Error parsing posts")
	}

	var ps []*post.Post
	for _, p := range posts {
		p, err := post.UnmarshalPostFromDB(
			p.Id,
			p.Content,
			p.AuthorId,
			p.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		ps = append(ps, p)
	}

	return ps, nil
}

func (r PostRepository) marshalPost(pr *post.Post) PostModel {
	return PostModel{
		Id:        pr.Id(),
		Content:   pr.Content(),
		AuthorId:  pr.AuthorId(),
		CreatedAt: pr.CreatedAt(),
	}
}
