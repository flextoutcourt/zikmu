import axios from 'axios';
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import TrackItem from '../Track/TrackItem';

class TopTracks extends React.PureComponent {
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
    return promise.then(data => data.data);
  };

  componentDidMount() {
    this._get_artist_top_tracks().then(json =>
      this.setState({topTracks: json}),
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            padding: 10,
            color: 'white',
          }}>
          Populaires
        </Text>
        <FlatList
          data={this.state.topTracks?.tracks}
          scrollEnabled={false}
          horizontal={false}
          style={{marginBottom: 50}}
          renderItem={({item, key}) => (
            <TrackItem track={item} album={item.album} />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(TopTracks);
