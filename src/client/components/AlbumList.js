import React from 'react';
import PropTypes from 'prop-types';

import spinner from '../spinner.svg';

const AlbumList = (props) => {
  if (props.albumsReady === false) {
    return (<img height="35px" src={spinner} alt="react" />);
  }
  return (
    <div>
      {props.albums.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr className="d-flex">
              <th className="col-3">ID</th>
              <th className="col-6">Nombre</th>
              <th className="col-3">Artista</th>
            </tr>
          </thead>
          <tbody>
            {props.albums.map(album => (
              <tr key={album._id} className="d-flex">
                <td className="col-3">{album._id}</td>
                <td className="col-6"><img width="64" height="64" src={album.image} alt={album.name} /> {album.name}</td>
                <td className="col-3">{album.artists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (<p>No hay albumes almacenados</p>)}

    </div>
  );
};

AlbumList.propTypes = {
  albums: PropTypes.array.isRequired,
  albumsReady: PropTypes.bool.isRequired,
};

export default AlbumList;
