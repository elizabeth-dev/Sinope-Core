package question

import (
	"time"

	"github.com/pkg/errors"
)

type Question struct {
	id        string
	recipient string
	content   string
	createdAt time.Time
}

func (q *Question) Id() string {
	return q.id
}

func (q *Question) Recipient() string {
	return q.recipient
}

func (q *Question) Content() string {
	return q.content
}

func (q *Question) CreatedAt() time.Time {
	return q.createdAt
}

type Factory struct {
}

func NewQuestion(
	id string,
	recipient string,
	content string,
) (*Question, error) {
	if id == "" {
		return nil, errors.New("[Question] Empty id")
	}

	if recipient == "" {
		return nil, errors.New("[Question] Empty recipient")
	}

	if content == "" {
		return nil, errors.New("[Question] Empty content")
	}

	return &Question{
		id:        id,
		recipient: recipient,
		content:   content,
		createdAt: time.Now(),
	}, nil
}

func UnmarshalQuestionFromDB(id string,
	recipient string,
	content string,
	createdAt time.Time) (*Question, error) {
	return &Question{id, recipient, content, createdAt}, nil
}
