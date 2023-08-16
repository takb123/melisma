# Melisma API

Made with Express and Node (hosted on Render). Accesses data from PostgreSQL server (hosted on Supabase) and Spotify API.

## Documentation
### `GET /`
Returns 200 OK. Used for health check.

## User
### `POST /api/user/signup`
Creates a new user with given credentials and signs in. Returns JWT which is used for user-specific requests.

Request Body
```ts
{
  email: string,
  username: string,
  password: string,
  confirm_password: string
}
```

Response
```ts
{
  username: string,
  token: string      // JWT
}
```

### `POST /api/user/signin`
Signs in with given user credential. Returns JWT which is used in header for user-specific requests.

Request Body
```ts
{
  email_username: string,
  password: string
}
```

Response
```ts
{
  username: string,
  token: string      // JWT
}
```

### `POST /api/user/follow/{username}`
Follows user with given username. Requires JWT in header. `success` is 1 if follow is successful, else 0.

Request Header
```ts
{
  Authorization: Bearer <JWT>
}
```

Response
```ts
{
  success: 0 | 1
}
```

### `POST /api/user/unfollow/{username}`
Unfollows user with given username. Requires JWT in header. `success` is 1 if unfollow is successful, else 0.

Request Header
```ts
{
  Authorization: Bearer <JWT>
}
```

Response
```ts
{
  success: 0 | 1
}
```

### `GET /api/user/profile/{username}`
Gets recently rated album data of given user. Optional JWT in header. `following` is 1 if the user associated with the JWT follows the given user, else 0.

Request Header (Optional)
```ts
{
  Authorization: Bearer <JWT>
}
```

Response
```ts
{
  albums: [{
    id: string,
    name: string,
    image: ImageObject,
    artists: [{
      id: string,
      name: string
    }]
  }],
  following: 0 | 1
}
```

### `GET /api/user/notifs`
Gets events of user associated with the JWT, which is rating events of users followed by the user, and follow actions to the user. Requires JWT in header.

Request Header
```ts
{
  Authorization: Bearer <JWT>
}
```

Response
```ts
{
  events: [{
    type: "track" | "follow",
    time: string,
    username: string,
    name: string,    // if type == "track"
    albumID: string  // if type == "track"
  }]
}
```


## Music
### `GET /api/music/album/{albumID}`
Gets data of given album. Optional JWT in header. `ratingScore` is the rating score (1-5) of track of the user associated with the JWT, else 0.

Request Header (Optional)
```ts
{
  Authorization: Bearer <JWT>
}
```

Response
```ts
{
  album: {
    id: string,
    name: string,
    image: ImageObject
  },
  artists: [{
    id: string,
    name: string
  }],
  tracks: [{
    id: string,
    name: string,
    ratingScore: number  // 0-5
  }]
}
```

### `GET /api/music/artist/{artistID}`
Gets profile and album data of given artist.

Response
```ts
{
  artist: {
    id: string,
    name: string,
    image: ImageObject
  },
  albums: [{
    id: string,
    name: string,
    image: ImageObject
  }]
}
```

### `GET /api/music/trending`
Gets data of up to 10 trending albums.

Response
```ts
{
  albums: [{
    id: string,
    name: string,
    image: ImageObject,
    artists: [{
      id: string,
      name: string
    }]
  }]
}
```

### `GET /api/music/rating/{trackID}`
Gets number of each star rating of given track. Required JWT in header. The user associated with the JWT must have rated the given track.

Request Header
```ts
{
  Authorization: Bearer <JWT>
}
```

Response
```ts
{
  one: number,
  two: number,
  three: number,
  four: number,
  five: number
}
```

### `POST /api/music/rating/{trackID}`
Creates a rating of the given track with the given score. Required JWT in header.

Request Header
```ts
{
  Authorization: Bearer <JWT>
}
```

Request Body
```ts
{
  ratingScore: number
}
```

Response
```ts
{
  ratingScore: number
}
```

### `GET /api/music/search/{query}`
Searches for albums, tracks, artists, and users with given query. Query must be in the form `?name=...` with URL Encoding

Response
```ts
{
  albums: [{
    id: string,
    name: string,
    image: ImageObject,
    artists: [{
      id: string,
      name: string
    }]
  }],
  artists: [{
    id: string,
    name: string,
    image: ImageObject
  }],
  tracks: [{
    id: string,
    name: string,
    album: {
      id: string,
      name: string,
      image: ImageObject
    }
  }],
  users: [{
    username: string
  }]
}
```

*Note: the `ImageObject` is from the Spotify API with the following format
```ts
{
  url: string,
  height: number,
  width: number
}
```
