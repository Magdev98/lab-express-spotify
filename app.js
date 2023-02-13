require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

// Iteration 3 | Search for an Artist
app.get('/artist-search', (req, res) => {
spotifyApi
  .searchArtists(req.query.artist)
  .then((data) => {
    console.log("The received data from the API: ", data);
    res.render('artist-search-results', {allArtists: data.body.artists.items})
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );
});

// Iteration 4 | View Albums
app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const artistId = req.params.artistId
    spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
    //res.send(data)
    res.render('albums', {allAlbums: data.body.items})
  })
  .catch(error => {
    next(error)
  });
});

// Iteration 5 | View Tracks
app.get('/album/:albumId/tracks', (req, res, next) => {
    const albumId = req.params.albumId
    spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
    //res.send(data)
    res.render('tracks', {allTracks: data.body.items})
  })
  .catch(error => {
    next(error)
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
