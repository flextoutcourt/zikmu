import axios from 'axios';
import React from 'react';
import {connect} from 'react-redux';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

class Artistitem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
    };
  }

  componentDidMount() {
    this._get_artist(this.props.artist_id).then(j => {
      this.setState({artist: j});
    });
  }

  _get_artist = artist_id => {
    const promise = axios.get(
      `https://api.spotify.com/v1/artists/${artist_id}`,
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

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Artist', {
            artist_id: this.props.artist_id,
          });
        }}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{uri: this.state.artist?.images[2]?.url}}
          style={{
            height: 48,
            width: 48,
            borderRadius: this.state.artist?.images[2].height,
            marginRight: 15,
          }}
        />
        <Text style={{color: 'white', fontSize: 16, fontWeight: '800'}}>
          {this.state.artist?.name}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(Artistitem);
