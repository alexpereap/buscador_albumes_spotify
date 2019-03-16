const request = require('request-promise');

const clientId = '5de5cc1dea9a49248447e9c1fc8c883e';
const clientSecret = 'f96497e6b670460a8b68279f9d9a1375';
const base64payload = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
// const base64payload = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
const EventEmitter = require('events');

class Spotify extends EventEmitter {
  constructor() {
    super();

    this._tokenReqConfig = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64payload}`
      },
      body: 'grant_type=client_credentials'
    };

    this._albumReqConfig = {
      url: 'https://api.spotify.com/v1/search',
      method: 'GET',
      headers: {
        Authorization: `Basic ${base64payload}`
      }
    };
  }

  getToken() {
    request(this._tokenReqConfig, (err, res, body) => {
      if (err) {
        this.emit('spotifyGetToken', { success: false, error: err });
      } else if (res.statusCode === 200) {
        this.emit('spotifyGetToken', { success: true, token: JSON.parse(body).access_token });
      } else {
        this.emit('spotifyGetToken', { success: false, error: `Codigo de respuesta invalido: ${res.statusCode}` });
      }
    });
  }

  getAlbum(albumName, token) {
    const reqOptions = {
      url: 'https://api.spotify.com/v1/search',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      qs: {
        q: albumName,
        type: 'album'
      }
    };

    request(reqOptions, (err, res, body) => {
      if (err) {
        this.emit('spotifyGetAlbum', { success: false, error: err, albums: [] });
      } else if (res.statusCode === 200) {
        const data = JSON.parse(body);
        if (data.albums.total > 0) {
          // parseo de album
          const albums = this.parseAlbum(data);
          // TODO DB insert
          this.emit('spotifyGetAlbum', { success: true, albums });
        } else {
          this.emit('spotifyGetAlbum', { success: true, albums: [] });
        }
      } else {
        this.emit('spotifyGetAlbum', { success: false, error: `Codigo de respuesta invalido: ${res.statusCode}` });
      }
    });
  }

  parseAlbum(data) {
    const albums = [];

    data.albums.items.forEach(element => {
      const artists = element.artists.map((el) => el.name).join(', ');

      albums.push({
        _id: element.id,
        name: element.name,
        artists,
        image: element.images[2] != null ? element.images[2].url : ''
      });
    });

    return albums;
  }
}

module.exports = Spotify;
