CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE follows (
    follow_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    following_id uuid NOT NULL REFERENCES users,
    follower_id uuid NOT NULL REFERENCES users,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follow_pair UNIQUE(following_id, follower_id),
    CONSTRAINT no_follow_itself CHECK(following_id <> follower_id)
);