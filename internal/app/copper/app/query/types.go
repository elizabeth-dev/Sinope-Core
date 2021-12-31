package query

import "time"

type Profile struct {
	Id           string
	Tag          string
	Name         string
	Description  string
	CreatedAt    time.Time
	FollowingIds []string
	FollowerIds  []string
}
