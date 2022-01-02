package question

import (
	"time"

	"github.com/pkg/errors"
)

type Question struct {
	id        string
	sender    string
	recipient string
	content   string
	anonymous bool
	createdAt time.Time
}

func (q *Question) Id() string {
	return q.id
}

func (q *Question) Sender() string {
	return q.sender
}

func (q *Question) Recipient() string {
	return q.recipient
}

func (q *Question) Content() string {
	return q.content
}

func (q *Question) Anonymous() bool {
	return q.anonymous
}

func (q *Question) CreatedAt() time.Time {
	return q.createdAt
}

type Factory struct {
}

func NewQuestion(
	id string,
	sender string,
	recipient string,
	content string,
	anonymous bool,
) (*Question, error) {
	if id == "" {
		return nil, errors.New("[Question] Empty id")
	}

	if sender == "" {
		return nil, errors.New("[Question] Empty sender")
	}

	if recipient == "" {
		return nil, errors.New("[Question] Empty recipient")
	}

	if content == "" {
		return nil, errors.New("[Question] Empty content")
	}

	return &Question{
		id:        id,
		sender:    sender,
		recipient: recipient,
		content:   content,
		anonymous: anonymous,
		createdAt: time.Now(),
	}, nil
}

func UnmarshalQuestionFromDB(id string,
	sender string,
	recipient string,
	content string,
	anonymous bool,
	createdAt time.Time) (*Question, error) {
	return &Question{id, sender, recipient, content, anonymous, createdAt}, nil
}
