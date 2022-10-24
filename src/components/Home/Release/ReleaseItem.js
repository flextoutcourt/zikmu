import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Liked from '../../Track/Liked';
import SpotifyWebApi from 'spotify-web-api-node';

const SpotifyApi = new SpotifyWebApi();

class ReleaseItem extends React.PureComponent {
  constructor(props) {
    super(props);
    SpotifyApi.setAccessToken(this.props.store.authentication.accessToken);
    this.state = {
      artist: null,
      liked: false,
    };
  }

  _check_liked = () => {
    SpotifyApi.containsMySavedAlbums([this.props.release.id]).then(data => {
      this.setState({liked: data.body[0]});
    });
  };

  _get_artist = () => {
    const promise = axios.get(
      `https://api.spotify.com/v1/artists/${this.props.release?.artists[0].id}`,
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
    this._get_artist().then(json => this.setState({artist: json}));
    this._check_liked();
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.push('Artist', {
              artist_id: this.state.artist?.id,
            })
          }
          style={{flexDirection: 'row', marginBottom: 10}}>
          <View style={{width: 50, height: 50}}>
            <Image
              source={{uri: this.state.artist?.images[0]?.url}}
              style={{...StyleSheet.absoluteFill, borderRadius: 50}}
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Text style={{color: 'white'}}>Dernière sortie de :</Text>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20}}>
              {this.state.artist?.name}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.push('Album', {
              album_id: this.props.release?.id,
            })
          }
          style={{
            width: Dimensions.get('screen').width - 50,
            backgroundColor: '#1E2732',
            marginBottom: 10,
            borderRadius: 10,
            elevation: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <View style={{height: 150, width: 150}}>
            <Image
              source={{uri: this.props.release?.images[0].url}}
              style={{
                ...StyleSheet.absoluteFill,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            />
          </View>
          <View
            style={{
              padding: 10,
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                {this.props.release?.name}
              </Text>
              <View
                style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <Text style={{color: 'white'}}>{this.props.release?.type}</Text>
                <FontAwesome
                  name={'circle'}
                  size={5}
                  style={{marginHorizontal: 5}}
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '800',
                  }}>
                  {this.props?.release?.artists[0]?.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {/*<LikedAlbum />*/}
              <Liked liked={this.state.liked} />
              <TouchableOpacity
                onPress={() => alert('test')}
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 36,
                  backgroundColor: '#7856FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome
                  name={'play'}
                  size={14}
                  color={'white'}
                  style={{marginLeft: 2, marginTop: 2}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(ReleaseItem);
