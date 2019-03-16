// Prueba api del servidor

const assert = require('assert');
const chai = require('chai');
const request = require('supertest');
const app = require('../src/server/index');

describe('probando ruta GET /api/spotify-album', function(){
  it('debe retornar status 200, content type: json y body tipo array', function(done){
      request(app)
      .get('/api/spotify-album')
      .then(function(response){
        assert.equal(response.status, 200);
        assert.equal(response.type, 'application/json');
        chai.expect(response.body).to.be.an('array');
        done();
      });
  });
});

describe('prueba ruta POST /api/spotify-album', function(){
  it('debe retornar status 200, content type json body tipo object', function(done){
    request(app)
    .post('/api/spotify-album')
    .send({search: 'this is acting'})
    .set('Content-Type', 'application/json')
    .then(function(response){
      assert.equal(response.status, 200);
      assert.equal(response.type, 'application/json');
      chai.expect(response.body).to.be.an('object');
      chai.assert.isBoolean(response.body.success);
      chai.expect(response.body.albums).to.be.an('array');
      done();
    });
  });
})
