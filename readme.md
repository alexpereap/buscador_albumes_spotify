# Buscador albumes spotify
La aplicación muestra un formulario de busqueda de albumes, al buscar un album, los resultados se almacenan en una base de datos mongo.
# Docker:
```sh
$ cd buscador_albumes_spotify
$ docker build -t alexpereap/spotify_albums_lookup .
$ docker run --name spotify_albums_lookup -p 8080:8080 -d alexpereap/spotify_albums_lookup
```
# Instrucciones:
Instalar depdendencias y correr el servidor:
```sh
$ cd buscador_albumes_spotify
$ npm install
$ npm start
visitar http://localhost:8080
```
Correr pruebas:
```sh
$ npm run test
```
Verificar sintaxis:
```sh
$ npm run lint
```
Generar version de producción:
```sh
$ npm run build
```

Datos mongo DB publica para consultas:
```sh
host: 45.55.38.139
puerto: 27017
usuario: spotifyAFB
pass: McLarenMp4
DB: spotifyAlbums
```


# Tecnologias usadas:
  - node js
  - React
  - MongoDB
# Estructura:
 - src/client contiene todo el front end y el codigo react.
 - src/server contiene todo el backend, una api rest construida con Express (index.js), una clase helper con funciones de comunicacion con spotify (spotify.js) y un modelo de mongo DB (AlbumModel.js)
