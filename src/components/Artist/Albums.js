import axios from 'axios';
import React, {Suspense} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import AlbumItem from '../Album/AlbumItem';

class Albums extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: null,
    };
  }

  _get_artist_album = () => {
    const promise = axios.get(
      `https://api.spotify.com/v1/artists/${this.props.artist.id}/albums`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    const response = promise.then(data => data.data);
    return response;
  };

  componentDidMount() {
    this._get_artist_album().then(json => this.setState({albums: json}));
  }

  render() {
    return (
      <Suspense fallback={null}>
        <FlatList
          data={this.state.albums?.items}
          horizontal={true}
          style={{marginBottom: 110}}
          renderItem={({item, key}) => <AlbumItem album={item} />}
        />
      </Suspense>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(Albums);
