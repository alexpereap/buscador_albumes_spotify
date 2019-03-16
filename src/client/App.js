import React from 'react';
import AlbumList from './components/AlbumList';
import spinner from './spinner.svg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      onQuery: false,
      albumsReady: false,
      albums: []
    };
  }

  componentDidMount() {
    // obtiene los albumes actualmente almacenados en la BD
    fetch('/api/spotify-album')
      .then(response => response.json())
      .then(json => {
        this.setState({ albums: json });
        this.setState({ albumsReady: true });
      });
  }

  setSearch = e => this.setState({ search: e.target.value });

  deleteAll = () => {
    if (confirm('Borrar todo ?')) {
      this.setState({ onQuery: true });
      fetch('/api/spotify-album', {
        method: 'DELETE',
      }).then(response => response.json())
        .then(json => {
          this.setState({ onQuery: false });
          if (json.success) {
            this.setState({ albums: [] });
          } else {
            alert(`Hubo un problema: ${json.error}`);
          }
        });
    }
  }

  searchAlbum = (e) => {
    e.preventDefault();
    if (this.state.search === '') {
      return false;
    }

    this.setState({ onQuery: true });

    fetch('/api/spotify-album', {
      method: 'POST',
      body: JSON.stringify({
        search: this.state.search,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ onQuery: false });

        if (json.success === true && json.albums.length > 0) {
        // almacena ids de albumes existentes en array
          const currentAlbumIds = this.state.albums.map(album => album._id);

          // almacena los nuevos albumes si no existen
          const newAlbums = json.albums.filter(album => {
            if (!currentAlbumIds.includes(album._id)) return album;
          });

          this.setState(prevState => ({
            albums: [
              ...newAlbums,
              ...prevState.albums]
          }));
        } else if (json.success === true && json.albums.length === 0) {
          alert(`Ooops! no hay resultados para: ${this.state.search}`);
        } else {
          alert(`Hubo un problema :( : ${json.error})`);
        }

        this.setState({ search: '' });
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.searchAlbum} disabled={this.state.onQuery}>
          <div className="form-group">
            <input
              value={this.state.search}
              type="text"
              className="form-control"
              placeholder="Busca un album"
              onChange={this.setSearch}
              required
            />
          </div>

          <button disabled={this.state.onQuery} type="submit" className="btn btn-success">Buscar</button>
          <button disabled={this.state.albums.length === 0} type="button" onClick={this.deleteAll} className="btn btn-danger">Borrar todos los albumes de la BD</button>
          {this.state.onQuery ? (<img height="35px" src={spinner} alt="react" />) : ('')}
          <hr />
        </form>
        <div>
          <h2>Albumes:</h2>
          <AlbumList albums={this.state.albums} albumsReady={this.state.albumsReady} />
        </div>
      </div>
    );
  }
}

export default App;
