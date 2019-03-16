const express = require('express');

const app = express();
const mongoose = require('mongoose');

const Spotify = require('./spotify');
const Album = require('./AlbumModel');

// DB Model
const AlbumModel = mongoose.model('Album', Album);

app.use(express.static('dist'));
app.use(express.json());

// api endpoint para resetear la bd
app.delete('/api/spotify-album', (req, res) => {
  mongoose.connection.collections.albums.drop((err) => {
    if (err) {
      res.send({ success: false, error: err });
    } else {
      res.send({ success: true });
    }
  });
});

// api endpoint para obtener lista de albumes desde la bd
app.get('/api/spotify-album', (req, res) => {
  AlbumModel.find()
    .then((doc) => {
      res.send(doc);
    });
});

// api endpoint para obtener el album desde spotify
app.post('/api/spotify-album', (req, res) => {
  // 1. obtiene token de spotify
  const spotify = new Spotify();
  spotify.getToken();

  spotify.on('spotifyGetToken', (data) => {
    if (data.success === true) {
      // 2. obtiene playlist
      const { search } = req.body;
      const { token } = data;
      spotify.getAlbum(search, token);
    } else {
      res.send(data);
    }
  });

  spotify.on('spotifyGetAlbum', (data) => {
    // Inserta albumes en BD si no es una prueba
    if (typeof req.body.test === 'undefined') {
      data.albums.forEach(albumDetail => {
        // si el album no existe... insert
        AlbumModel.findById(albumDetail._id, (err, doc) => {
          if (!doc) {
            const album = new AlbumModel(albumDetail);
            album.save();
          }
        });
      });
    }

    res.send(data);
  });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
module.exports = app;
