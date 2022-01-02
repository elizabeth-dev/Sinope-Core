package adapter

import (
	"context"
	"time"

	"github.com/elizabeth-dev/Sinope-Core/internal/app/copper/domain/profile"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProfileModel struct {
	Id          string    `bson:"id"`
	Tag         string    `bson:"tag"`
	Name        string    `bson:"name"`
	Description string    `bson:"description"`
	CreatedAt   time.Time `bson:"created_at"`
	Users       []string  `bson:"users"`
}

type ProfileRepository struct {
	col *mongo.Collection
}

func NewProfileRepository(dbClient *mongo.Database) ProfileRepository {
	if dbClient == nil {
		panic("[ProfileRepository] missing dbClient")
	}

	return ProfileRepository{col: dbClient.Collection("profile")}
}

func (r ProfileRepository) GetProfile(
	ctx context.Context,
	profileId string,
) (*profile.Profile, error) {
	var profileModel ProfileModel

	err := r.col.FindOne(ctx, bson.D{{Key: "id", Value: profileId}}).Decode(&profileModel)

	if err != nil {
		return nil, errors.Wrap(err, "[ProfileRepository] Error retrieving profile "+profileId)
	}

	p, err := profile.UnmarshalProfileFromDB(
		profileModel.Id,
		profileModel.Tag,
		profileModel.Name,
		profileModel.Description,
		profileModel.CreatedAt,
		profileModel.Users,
	)

	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r ProfileRepository) CreateProfile(ctx context.Context, pr *profile.Profile) error {
	profileModel := r.marshalProfile(pr)

	if _, err := r.col.InsertOne(ctx, profileModel); err != nil {
		return err
	}

	return nil
}

func (r ProfileRepository) marshalProfile(pr *profile.Profile) ProfileModel {
	return ProfileModel{
		Id:          pr.Id(),
		Tag:         pr.Tag(),
		Name:        pr.Name(),
		Description: pr.Description(),
		CreatedAt:   pr.CreatedAt(),
		Users:       pr.Users(),
	}
}
