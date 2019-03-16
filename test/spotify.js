// prueba la clase spotify
const assert = require('assert');
const chai = require('chai');
const Spotify = require('../src/server/spotify');
var spotify;
var token;
var albums;

beforeEach(function(){
  spotify = new Spotify;
})

describe('pruebas de la clase spotify',function(){

  it('debe obtener token de autenticacion', function(done){
    spotify.getToken();
    spotify.on('spotifyGetToken', function(data){
      chai.expect(data).to.be.an('object');
      chai.assert.isBoolean(data.success);
      assert.equal(data.success, true);
      chai.assert.isString(data.token);
      token = data.token;
      done();
    });
  });

  it('debe obtener albums', function(done){
    spotify.getAlbum('this is acting', token);
    spotify.on('spotifyGetAlbum', function(data){
      chai.expect(data).to.be.an('object');
      chai.assert.isBoolean(data.success);
      assert.equal(data.success, true);
      chai.expect(data.albums).to.be.an('array');
      albums = data.albums;
      done();
    });

  });

  it('albumes deben tener esquema valido', function(done){
    albums.forEach(album => {
      chai.expect(album).to.be.an('object');
      const schema = ['_id', 'name', 'artists', 'image'];
      schema.forEach( element =>{
        chai.expect(album).to.have.property(element);
        chai.assert.isString(element);
      });
    });

    done();
  })
});
