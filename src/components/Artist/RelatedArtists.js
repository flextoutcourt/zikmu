import axios from 'axios';
import React, {Suspense} from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import ArtistAlt from './ArtistAlt';

class RelatedArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      related: null,
    };
  }

  _get_artist_related = () => {
    const promise = axios.get(
      `https://api.spotify.com/v1/artists/${this.props.artist.id}/related-artists`,
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
    this._get_artist_related().then(json => this.setState({related: json}));
  }

  render() {
    return (
        <View style={{flex: 1}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10}}>Similaires a {this.props.artist?.name}</Text>
          <FlatList
              data={this.state.related?.artists}
              horizontal={true}
              style={{marginBottom: 110}}
              renderItem={({item, key}) => <ArtistAlt artist={item} {...this.props.navigation} />}
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

export default connect(mapStateToProps)(RelatedArtists);
