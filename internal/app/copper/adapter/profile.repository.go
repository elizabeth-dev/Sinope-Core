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
	Avatar      string    `bson:"avatar"`
	Description string    `bson:"description"`
	CreatedAt   time.Time `bson:"created_at"`
	Users       []string  `bson:"users"`
	Following   []string  `bson:"following"`
	Followers   []string  `bson:"followers"`
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

	err := r.col.FindOne(ctx, bson.D{{"id", profileId}}).Decode(&profileModel)

	if err != nil {
		return nil, errors.Wrap(err, "[ProfileRepository] Error retrieving profile "+profileId)
	}

	p, err := profile.UnmarshalProfileFromDB(
		profileModel.Id,
		profileModel.Tag,
		profileModel.Name,
		profileModel.Avatar,
		profileModel.Description,
		profileModel.CreatedAt,
		profileModel.Users,
		profileModel.Following,
		profileModel.Followers,
	)

	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r ProfileRepository) GetProfileByTag(ctx context.Context, tag string) (*profile.Profile, error) {
	var profileModel ProfileModel

	err := r.col.FindOne(ctx, bson.D{{"tag", tag}}).Decode(&profileModel)

	if err != nil {
		return nil, errors.Wrap(err, "[ProfileRepository] Error retrieving profile for tag "+tag)
	}

	p, err := profile.UnmarshalProfileFromDB(profileModel.Id,
		profileModel.Tag,
		profileModel.Name,
		profileModel.Avatar,
		profileModel.Description,
		profileModel.CreatedAt,
		profileModel.Users,
		profileModel.Following,
		profileModel.Followers,
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

func (r ProfileRepository) AddFollower(ctx context.Context, from string, to string) error {
	if _, err := r.col.UpdateByID(ctx, to, bson.D{{"$addToSet", bson.D{{"followers", from}}}}); err != nil {
		return err
	}

	// TODO: Parallelize this
	if _, err := r.col.UpdateByID(ctx, from, bson.D{{"$addToSet", bson.D{{"following", to}}}}); err != nil {
		return err
	}

	return nil
}

func (r ProfileRepository) RemoveFollower(ctx context.Context, from string, to string) error {
	if _, err := r.col.UpdateByID(ctx, to, bson.D{{"$pullAll", bson.D{{"followers", from}}}}); err != nil {
		return err
	}

	// TODO: Parallelize this
	if _, err := r.col.UpdateByID(ctx, from, bson.D{{"$pullAll", bson.D{{"following", to}}}}); err != nil {
		return err
	}

	return nil
}

func (r ProfileRepository) marshalProfile(pr *profile.Profile) ProfileModel {
	return ProfileModel{
		Id:          pr.Id(),
		Tag:         pr.Tag(),
		Name:        pr.Name(),
		Avatar:      pr.Avatar(),
		Description: pr.Description(),
		CreatedAt:   pr.CreatedAt(),
		Users:       pr.Users(),
		Following:   pr.Following(),
		Followers:   pr.Followers(),
	}
}
