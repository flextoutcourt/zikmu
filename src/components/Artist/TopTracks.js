import axios from 'axios';
import React, {Suspense} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import TrackItem from '../Track/TrackItem';

class TopTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: null,
    };
  }

  _get_artist_top_tracks = () => {
    const promise = axios.get(
      `https://api.spotify.com/v1/artists/${this.props.artist.id}/top-tracks?country=FR`,
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
    this._get_artist_top_tracks().then(json =>
      this.setState({topTracks: json}),
    );
  }

  render() {
    return (
      <Suspense fallback={null}>
        <FlatList
          data={this.state.topTracks?.tracks}
          scrollEnabled={false}
          horizontal={false}
          style={{marginBottom: 110}}
          renderItem={({item, key}) => (
            <TrackItem track={item} album={item.album} />
          )}
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

export default connect(mapStateToProps)(TopTracks);
