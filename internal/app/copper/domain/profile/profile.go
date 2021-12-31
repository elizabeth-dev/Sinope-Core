package profile

import (
	"time"

	"github.com/pkg/errors"
)

type Profile struct {
	id          string
	tag         string
	name        string
	description string
	createdAt   time.Time
}

func (p *Profile) Id() string {
	return p.id
}

func (p *Profile) Tag() string {
	return p.tag
}

func (p *Profile) Name() string {
	return p.name
}

func (p *Profile) Description() string {
	return p.description
}

func (p *Profile) CreatedAt() time.Time {
	return p.createdAt
}

type Factory struct {
}

func NewProfile(id string, tag string, name string, description string) (*Profile, error) {
	if id == "" {
		return nil, errors.New("[Profile] Empty id")
	}

	if tag == "" {
		return nil, errors.New("[Profile] Empty tag")
	}

	if name == "" {
		return nil, errors.New("[Profile] Empty name")
	}

	return &Profile{
		id:          id,
		tag:         tag,
		name:        name,
		description: description,
		createdAt:   time.Now(),
	}, nil
}

func UnmarshalProfileFromDB(id string,
	tag string,
	name string,
	description string,
	createdAt time.Time) (*Profile, error) {
	return &Profile{id, tag, name, description, createdAt}, nil
}
