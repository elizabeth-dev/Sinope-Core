package query

import "time"

type Profile struct {
	Id          string
	Tag         string
	Name        string
	Avatar      string
	Description string
	CreatedAt   time.Time
	Users       []string
	Following   []string
	Followers   []string
}

type Question struct {
	Id        string
	Sender    string
	Recipient string
	Content   string
	Anonymous bool
	CreatedAt time.Time
}

type Post struct {
	Id        string
	Content   string
	AuthorId  string
	CreatedAt time.Time
}
