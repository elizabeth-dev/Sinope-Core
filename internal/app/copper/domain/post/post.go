package post

import (
	"time"

	"github.com/pkg/errors"
)

type Post struct {
	id        string
	content   string
	authorId  string
	createdAt time.Time
}

func (p *Post) Id() string {
	return p.id
}

func (p *Post) Content() string {
	return p.content
}

func (p *Post) AuthorId() string {
	return p.authorId
}

func (p *Post) CreatedAt() time.Time {
	return p.createdAt
}

func (p *Post) CheckProfileOwnership(profileId string) bool {
	return p.authorId == profileId
}

type Factory struct {
}

func NewPost(id string, content string, authorId string) (*Post, error) {
	if id == "" {
		return nil, errors.New("[Post] Empty id")
	}

	if content == "" {
		return nil, errors.New("[Post] Empty content")
	}

	if authorId == "" {
		return nil, errors.New("[Post] Empty author id")
	}

	return &Post{
		id:        id,
		content:   content,
		authorId:  authorId,
		createdAt: time.Now(),
	}, nil
}

func UnmarshalPostFromDB(id string, content string, authorId string, createdAt time.Time) (*Post, error) {
	return &Post{id, content, authorId, createdAt}, nil
}
