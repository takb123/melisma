CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE ratings (
    rating_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users,
    track_id VARCHAR(30) NOT NULL,
    album_id VARCHAR(30) NOT NULL,
    rating_score INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_track_pair UNIQUE(user_id, track_id)
);