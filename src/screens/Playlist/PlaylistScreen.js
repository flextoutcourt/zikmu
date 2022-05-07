import axios from 'axios';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {Extrapolate} from 'react-native-reanimated';
import {connect} from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';
import Header from '../../components/Playlist/Header';
import {SharedElement} from 'react-navigation-shared-element';

class PlaylistScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: null,
      playlistItems: null,
      scrollY: new Animated.Value(0),
      englithment: null,
      suggested: null,
      isLoadingTracks: true,
    };
  }

  _get_playlist = offset => {
    const promise = axios.get(
      `https://api.spotify.com/v1/playlists/${this.props.route.params.playlist_id}`,
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

  _get_playlist_tracks = (offset, limit = 20) => {
    this.setState({isLoadingTracks: true});
    const promise = axios.get(
      `https://api.spotify.com/v1/playlists/${this.props.route.params.playlist_id}/tracks?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.props.store.authentication.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return promise.then(data => data.data);
  };

  _to_array_tracks = () => {
    let tracks_array = [];
    this.state.playlist?.tracks.items.map(item => {
      tracks_array.push(item.track?.id);
    });
    return tracks_array.toString();
  };
  _to_array_genres = () => {
    let genre_array = [];
    this.state.playlist?.tracks.items.map(item => {
      genre_array.push(item.genre.id);
    });
    return genre_array.toString();
  };
  _to_array_artists = () => {
    let artist_array = [];
    this.state.playlist?.tracks.items.map(item => {
      item.track.artists.map(artist => {
        artist_array.push(artist.id);
      });
    });
    return artist_array.toString();
  };

  _call_enligth = (limit = 5, array = null) => {
    const promise = axios.get(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${
        array
          ? array[Math.floor(Math.round(array.length - 1))].track.id
          : this.state.playlistItems[
              Math.floor(Math.random() * this.state.playlistItems.length - 1)
            ].track.id
      }&limit=5`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    return promise.then(data => data);
  };

  _enlight_playlist = () => {
    // console.log(this._to_array_artists());
    const promise = this._call_enligth(5);
    return promise.then(data => {
      let tracks = [];
      let tracks_uris = '';
      data.data.tracks.map((item, key) => {
        tracks.push({track: item});
        if (key !== data.data.tracks.length - 1) {
          tracks_uris += item.uri + ',';
        } else {
          tracks_uris += item.uri;
        }
      });
      // alert(JSON.stringify(tracks_uris));
      this._add_to_playlist(tracks_uris);
      this.setState({playlistItems: [...this.state.playlistItems, ...tracks]});
    });
  };

  _add_to_playlist = tracks_uris => {
    const promise = fetch(
      `https://api.spotify.com/v1/playlists/${this.props.route.params.playlist_id}/tracks?uris=${tracks_uris}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );
    return promise.then(data => data);
  };

  _get_suggested = array => {
    const promise = this._call_enligth(10, array);
    promise.then(data => {
      let tracks = [];
      data.data.tracks.map((item, key) => {
        tracks.push({track: item});
      });
      this.setState({suggested: tracks});
    });
  };

  _get_user = href => {
    const promise = axios.get(`${href}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
    });
    return promise.then(data => data.data);
  };

  _get_collab = json => {
    let users = [];
    json.tracks?.items?.map((item, key) => {
      if (users.indexOf(item?.added_by?.href) === -1) {
        users.push(item?.added_by?.href);
      }
    });
    let users_array = [];
    users?.map((item, key) => {
      this._get_user(item).then(json => {
        users_array.push(json);
      });
    });
    return users_array;
  };

  componentDidMount() {
    const opacity = this.state.scrollY.interpolate({
      inputRange: [250, 325],
      outputRange: [0, 0.5],
      extrapolate: Extrapolate.CLAMP,
    });
    this._get_playlist().then(json => {
      this.setState({playlist: json});
      if (json.collaborative) {
        this._get_playlist_tracks(0).then(json => {
          this.setState({playlistItems: json.items, isLoadingTrack: false});
          this._get_collab(json);
        });
        let users_array = this._get_collab(json);
        this.setState(prevState => ({
          ...prevState,
          playlist: {
            ...prevState.playlist,
            collab_users: {
              users_array,
            },
          },
        }));
      }

      this._get_suggested(json.tracks.items);
    });
  }

  render() {
    const scale = this.state.scrollY.interpolate({
      inputRange: [-Dimensions.get('screen').height, 0, 125],
      outputRange: [2, 1, 0.5],
      extrapolateRight: Extrapolate.CLAMP,
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [1, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    const mb = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [10, -75],
      extrapolate: Extrapolate.CLAMP,
    });

    const height = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [
        Dimensions.get('screen').width - StatusBar.currentHeight * 2,
        Dimensions.get('screen').width,
      ],
      extrapolate: Extrapolate.CLAMP,
    });

    const mt = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [StatusBar.currentHeight + 10, StatusBar.currentHeight + 30],
      extrapolate: Extrapolate.CLAMP,
    });

    const ml = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [StatusBar.currentHeight, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    const br = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [10, 25],
      extrapolate: Extrapolate.CLAMP,
    });

    const transform = [{scale}];
    return (
      <LinearGradient
        colors={['#34495e', '#34495e']}
        style={{
          marginTop: -StatusBar.currentHeight,
          ...styles.container,
          paddingTop: StatusBar.currentHeight,
        }}>
        <SharedElement
          id={this.props.route.params.playlist_id}
          style={{
            flex: 1,
            width: Dimensions.get('screen').width - StatusBar.currentHeight * 2,
            height:
              Dimensions.get('screen').width - StatusBar.currentHeight * 2,
          }}>
          <Animated.Image
            source={{uri: this.state.playlist?.images[0]?.url}}
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                width:
                  Dimensions.get('screen').width - StatusBar.currentHeight * 2,
                height:
                  Dimensions.get('screen').width - StatusBar.currentHeight * 2,
                resizeMode: 'cover',
                borderRadius: 10,
              },
            ]}
          />
        </SharedElement>
        {this.state.playlist ? (
          <FlatList
            data={this.state.playlistItems}
            scrollEnabled={false}
            horizontal={false}
            onEndReachedThreshold={0.2}
            removeClippedSubviews={true}
            onEndReached={() => {
              this._get_playlist_tracks(this.state.playlistItems.length).then(
                json => {
                  this.setState(prevState => ({
                    playlistItems: prevState.playlistItems.concat(json.items),
                  }));
                  this._get_collab(json);
                },
              );
            }}
            ListFooterComponent={() =>
              this.state.isLoadingTracks ? <ActivityIndicator /> : null
            }
            ListHeaderComponent={() => (
              <Animated.View style={{}}>
                <Animated.View style={{opacity: opacity}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 28,
                      color: 'white',
                    }}>
                    {this.state.playlist?.name}
                  </Text>
                </Animated.View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <View
                    style={{
                      padding: 10,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      onPress={() => this._enlight_playlist()}
                      style={{
                        borderStyle: 'solid',
                        borderRadius: 100,
                        borderColor: 'white',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name="heart"
                        size={16}
                        color="white"
                        style={{marginRight: 5}}
                      />
                      <Text style={{color: 'white'}}>Enrichir</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      padding: 5,
                      paddingVertical: 10,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      onPress={() => alert('telecharger la playlist')}
                      style={{
                        padding: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name="download"
                        size={16}
                        color="white"
                        style={{marginRight: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      padding: 5,
                      paddingVertical: 10,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      onPress={() => alert('Ajouter un collaborateur')}
                      style={{
                        padding: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name="user-plus"
                        size={16}
                        color="white"
                        style={{marginRight: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      padding: 5,
                      paddingVertical: 10,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      onPress={() => alert('Voir les détails')}
                      style={{
                        padding: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name="more-vertical"
                        size={16}
                        color="white"
                        style={{marginRight: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 10,
                    marginVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this._enlight_playlist().then(json =>
                        alert(JSON.stringify(json)),
                      )
                    }
                    style={{
                      borderStyle: 'solid',
                      borderRadius: 100,
                      borderColor: 'white',
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name="plus"
                      size={16}
                      color="white"
                      style={{marginRight: 5}}
                    />
                    <Text style={{color: 'white'}}>Ajouter des titres</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
            renderItem={({item, key, index}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Playlist', {
                    playlist_id: item.track.id,
                  })
                }>
                <TrackItem
                  track={item?.track}
                  album={item?.track?.album}
                  playlist={this.state.playlist}
                  collab_users={this.state.playlist?.collab_users}
                  added_by={item.added_by}
                  type={'playlist'}
                  playlist_uri={this.state.playlist?.uri}
                  playlist_index={index}
                />
              </TouchableOpacity>
            )}
          />
        ) : null}
        {/*<LinearGradient*/}
        {/*  colors={['#2c3e50', '#2c3e50']}*/}
        {/*  style={{marginTop: 25, padding: 10}}>*/}
        {/*  <View*/}
        {/*    style={{*/}
        {/*      padding: 10,*/}
        {/*      alignItems: 'center',*/}
        {/*      justifyContent: 'flex-start',*/}
        {/*      flex: 1,*/}
        {/*    }}>*/}
        {/*    <TouchableOpacity*/}
        {/*      onPress={() =>*/}
        {/*        this._enlight_playlist().then(json =>*/}
        {/*          alert(JSON.stringify(json)),*/}
        {/*        )*/}
        {/*      }*/}
        {/*      style={{*/}
        {/*        paddingHorizontal: 10,*/}
        {/*        paddingVertical: 5,*/}
        {/*        flexDirection: 'row',*/}
        {/*        alignItems: 'center',*/}
        {/*        justifyContent: 'center',*/}
        {/*      }}>*/}
        {/*      <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>*/}
        {/*        Nos Suggestions*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*    <View*/}
        {/*      style={{height: 800, width: Dimensions.get('screen').width - 20}}>*/}
        {/*      <FlatList*/}
        {/*        data={this.state.suggested}*/}
        {/*        keyExtractor={(item, index) => index.toString()}*/}
        {/*        renderItem={(item, index) => (*/}
        {/*          <TrackItem*/}
        {/*            track={item?.track}*/}
        {/*            album={item?.track?.album}*/}
        {/*            playlist={this.state.playlist}*/}
        {/*            collab_users={this.state.playlist?.collab_users}*/}
        {/*            added_by={item.added_by}*/}
        {/*            type={'playlist'}*/}
        {/*            playlist_uri={this.state.playlist?.uri}*/}
        {/*            playlist_index={index}*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      />*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</LinearGradient>*/}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(PlaylistScreen);
