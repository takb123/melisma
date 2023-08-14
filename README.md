# melisma
PERN-stack web app to rate albums and songs, and view other user's ratings

Link: https://melisma.vercel.app/

<img src="https://github.com/takb123/melisma/assets/108496923/96af4de5-a269-489a-9004-33bcf21c9ab7" width="80%"/>

Note: phone screens and dark modes break the styling, so access on a computer with light mode

## Motivation
In most music review sites, you can see the rating of a song before you rate it, which might influence your own rating and skew the overall result.
So I made a review app where you can't see the overall rating of a song until you rate it.

The UI/UX is inspired by Spotify and Letterboxd.

## How It Works
The music data is fetched from the Spotify API, and the rest of the data (users, follow relationships, ratings, etc.) is stored on a PostgreSQL server hosted on Supabase.

The REST API backend is written in Express and is hosted on Render. It accesses data from the Postgres server with node-postgres. I implemented caching with node-cache to reduce Spotify API calls. User authentication is through JWT.

The React frontend is built with Vite and hosted on Vercel. Some of the libraries I used are redux, redux toolkit, react-toastify, and chart.js.
