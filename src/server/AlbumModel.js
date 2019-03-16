// MongoDB Config
const mongoose = require('mongoose');

mongoose.connect('mongodb://spotifyAFB:McLarenMp4@45.55.38.139:27017/spotifyAlbums', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   console.log("connected to mongo db");
// });

const { Schema } = mongoose;

const Album = new Schema({
  _id: String,
  name: String,
  artists: String,
  image: String
});

module.exports = Album;
