import axios from 'axios';
import React, {Suspense} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {Extrapolate} from 'react-native-reanimated';
import {connect} from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';
import Header from '../../components/Playlist/Header';
import Playlist from '../../components/Genres/Playlist';
import SpotifyWebApi from 'spotify-web-api-node';
import SearchMenu from './SearchMenu';

const SpotifyApi = new SpotifyWebApi();

class PlaylistScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: null,
      scrollY: new Animated.Value(0),
      englithment: null,
      recommendations: false,
      related_playlist: false,
      search_menu: false,
      search_results: false,
      search: '',
      playlist_liked: false,
      modalVisible: false,
    };
    SpotifyApi.setAccessToken(this.props.store.authentication.accessToken);
  }

  /**
   *
   * @returns {Promise<AxiosResponse<any>>}
   * @private
   */
  _get_playlist = () => {
    const promise = SpotifyApi.getPlaylist(this.props.route.params.playlist_id);

    return promise.then(data => data.body);

    // const promise = axios.get(
    //   'https://api.spotify.com/v1/playlists/' +
    //     this.props.route.params.playlist_id,
    //   {
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization:
    //         'Bearer ' + this.props.store.authentication.accessToken,
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
    // return promise.then(data => data.data);
  };

  /**
   *
   * @param {array} arr
   * @private
   */
  _remove_duplicated = arr =>
    arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));

  /**
   *
   * @param {Object} json
   * @param {string} type
   * @private
   */
  _format_ids = (json, type) => {
    let arr = [];
    if (type === 'artists') {
      json.tracks.items.map((item, key) =>
        item.track.artists.map((item, index) => arr.push(item.id)),
      );
      //
      arr = this._remove_duplicated(artistsId);
      arr = artistsId.splice(0, 2).join(',');
    } else if (type === 'tracks') {
      json.tracks.items.map((item, key) => arr.push(item.id));
      arr = this._remove_duplicated(arr);
      arr = tracksId.splice(0, 2).join(',');
    }
  };

  /**
   *
   * @returns {Promise<AxiosResponse<any>>}
   * @private
   */
  _get_related_playlists = () => {
    SpotifyApi.getFeaturedPlaylists().then(data => {
      this.setState({related_playlist: data.body.playlist});
    });
  };

  /**
   *
   * @param {Object} json
   * @private
   */
  _get_recommended_playlists = json => {
    let tracksId = this._format_ids(json, 'tracks');
    let artistsId = this._format_ids(json, 'artists');
    SpotifyApi.getRecommendations({
      seed_artists: artistsId,
      seed_genres: '*',
      seed_tracks: tracksId,
    }).then(data => {
      this.setState({recommendations: data.body});
    });
    // const promise = axios.get(
    //   `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${artistsId}&seed_genres=*&seed_tracks=${tracksId}`,
    //   {
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization:
    //         'Bearer ' + this.props.store.authentication.accessToken,
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
    // promise.then(data => this.setState({recommendations: data.data}));
  };

  /**
   *
   * @returns {string}
   * @private
   */
  _to_array_tracks = () => {
    let tracks_array = [];
    this.state.playlist?.tracks.items.map(item => {
      tracks_array.push(item.track?.id);
    });
    return tracks_array.toString();
  };
  /**
   *
   * @returns {string}
   * @private
   */
  _to_array_genres = () => {
    let genre_array = [];
    this.state.playlist?.tracks.items.map(item => {
      genre_array.push(item.genre.id);
    });
    return genre_array.toString();
  };
  /**
   *
   * @returns {string}
   * @private
   */
  _to_array_artists = () => {
    let artist_array = [];
    this.state.playlist?.tracks.items.map(item => {
      item.track.artists.map(artist => {
        artist_array.push(artist.id);
      });
    });
    return artist_array.toString();
  };
  /**
   *
   * @returns {Promise<AxiosResponse<any>>}
   * @private
   */
  _enlight_playlist = () => {
    const promise = axios.get(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${
        this.state.playlist?.tracks?.items[0]?.track?.id ??
        this.props.store.liked?.liked?.items[0]?.track?.id
      }&limit=10`,
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

  /**
   *
   * @param {string} href
   * @returns {Promise<AxiosResponse<any>>}
   * @private
   */
  _get_user = href => {
    return SpotifyApi.getMe(data => {
      data.data;
    });
    // const promise = axios.get(`${href}`, {
    //   headers: {
    //     Accept: 'application/json',
    //     Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // return promise.then(data => data.data);
  };

  _get_owner = json => {
    SpotifyApi.getUser(json?.owner?.id).then(data => {
      this.setState({owner: data.body});
    });
  };

  componentDidMount() {
    const opacity = this.state.scrollY.interpolate({
      inputRange: [250, 325],
      outputRange: [0, 0.5],
      extrapolate: Extrapolate.CLAMP,
    });
    this._store_playlist();
    this._get_related_playlists();
  }

  /**
   * Store playlist into state
   *
   * @private
   */
  _store_playlist = () => {
    this._get_playlist().then(json => {
      this.setState({playlist: json});
      this._get_liked(json);
      this._get_owner(json);
      this._get_recommended_playlists(json);
      if (json.collaborative) {
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
        this.setState(prevState => ({
          playlist: {
            collab_users: {
              users_array,
            },
          },
        }));
      }
    });
  };

  _search_results = val => {
    SpotifyApi.searchTracks(val, {limit: 7}).then(data =>
      this.setState({search_results: data.body?.tracks?.items}),
    );
    this.setState({search: val});
    // fetch(`https://api.spotify.com/v1/search?q=${val}&type=track&limit=7`, {
    //   headers: {
    //     Accept: 'application/json',
    //     Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     this.setState({search_results: data.tracks?.items});
    //   });
  };

  _deploy_contextual_menu = item_id => {
    SpotifyApi.getPlaylistTracks(this.state.playlist?.id).then(data =>
      setTimeout(() => {
        this._store_playlist();
      }, 200),
    );
    // fetch(
    //   `https://api.spotify.com/v1/playlists/${this.state.playlist.id}/tracks`,
    //   {
    //     method: 'DELETE',
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization:
    //         'Bearer ' + this.props.store.authentication.accessToken,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       tracks: [
    //         {
    //           uri: `${item_id}`,
    //         },
    //       ],
    //     }),
    //   },
    // )
    //   .then(r => r.json())
    //   .then(data => setTimeout(() => this._store_playlist(), 200));
  };

  _on_like = () => {
    this.state.playlist_liked
      ? SpotifyApi.unfollowPlaylist(this.state?.playlist?.id).then(data => {
          this.setState({playlist_liked: false});
        })
      : SpotifyApi.followPlaylist(this.state.playlist?.id).then(data =>
          this.setState({playlist_liked: !this.state.playlist_liked}),
        );
  };

  _get_me = () => {
    const promise = SpotifyApi.getMe();
    return promise.then(data => {
      this.setState({me: data.body});
      return data.body;
    });
  };

  _on_info = () => {
    this.setState({modalVisible: true});
  };

  _get_liked = data => {
    this._get_me().then(response => {
      axios
        .get(
          `	https://api.spotify.com/v1/playlists/${this.state.playlist?.id}/followers/contains?ids=${response?.id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization:
                'Bearer ' + this.props.store.authentication.accessToken,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(data => this.setState({playlist_liked: data.data[0]}));
    });
  };

  render() {
    const scale = this.state.scrollY.interpolate({
      inputRange: [-Dimensions.get('screen').height, 0, 125],
      outputRange: [2, 1, 0.5],
      extrapolateRight: Extrapolate.CLAMP,
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    const mb = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [10, -75],
      extrapolate: Extrapolate.CLAMP,
    });
    const br = this.state.scrollY.interpolate({
      inputRange: [0, 10],
      outputRange: [0, 10],
      extrapolate: Extrapolate.CLAMP,
    });
    const height = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [
        Dimensions.get('screen').width,
        Dimensions.get('screen').width,
      ],
      extrapolate: Extrapolate.CLAMP,
    });
    const mt = this.state.scrollY.interpolate({
      inputRange: [0, Dimensions.get('window').height * 10],
      outputRange: [Dimensions.get('screen').width - 20, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    const borderRadius = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [0, 350],
      extrapolate: Extrapolate.CLAMP,
    });
    const transform = [{scale}];
    return (
      <LinearGradient
        colors={['#15202B', '#15202B']}
        style={{
          ...styles.container,
          paddingTop: StatusBar.currentHeight,
        }}>
        <Header
          y={this.state.scrollY}
          playlist={this.state.playlist}
          liked={this.state.playlist_liked}
          onLike={this._on_like}
          onInfo={this._on_info}
          {...this.props}
        />
        <Animated.ScrollView
          style={{zIndex: 98}}
          ref={ref => (this.flatListRef = ref)}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {listener: '', useNativeDriver: true},
          )}>
          <Animated.View style={{marginTop: mt, backgroundColor: '#15202B'}}>
            {this.state.playlist ? (
              <FlatList
                data={this.state.playlist?.tracks?.items}
                scrollEnabled={false}
                horizontal={false}
                ref={ref => {
                  this.listViewRef = ref;
                }}
                scrollToOverflowEnabled={true}
                style={{paddingBottom: 120}}
                ListHeaderComponent={() =>
                  this.state.playlist?.collaborative ||
                  this.state.playlist?.owner?.id === this.state?.me?.id ? (
                    <>
                      <View
                        style={{marginHorizontal: 10, flexDirection: 'row'}}>
                        <View style={{flex: 1}} />
                        <TouchableOpacity
                          onPress={() =>
                            this.state.recommendations == false
                              ? this._enlight_playlist().then(data => {
                                  this.setState({
                                    recommendations: data,
                                  });
                                  this.flatListRef.scrollTo({
                                    x: 0,
                                    y: Dimensions.get('screen').height * 10,
                                    animated: true,
                                  });
                                })
                              : this.setState({
                                  recommendations: false,
                                })
                          }
                          style={{flex: 2}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: 'transparent',
                              borderColor:
                                this.state.recommendations === false
                                  ? 'white'
                                  : '#6C4DE6',
                              borderWidth: 2,
                              justifyContent: 'center',
                              padding: 3,
                              borderRadius: 100,
                              marginBottom: 10,
                            }}>
                            <Icon
                              name={
                                this.state.recommendations
                                  ? 'color-wand'
                                  : 'color-wand-outline'
                              }
                              size={24}
                              color={
                                this.state.recommendations === false
                                  ? 'white'
                                  : '#6C4DE6'
                              }
                            />
                            <Text
                              style={{
                                color:
                                  this.state.recommendations === false
                                    ? 'white'
                                    : '#6C4DE6',
                              }}>
                              Enrichir
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={{flex: 1}} />
                        <TouchableOpacity
                          onPress={() => {
                            this.flatListRef.scrollTo({
                              x: 0,
                              y: this.state.search_menu ? 0 : 300,
                              animated: true,
                            });
                            return this.state.search_menu === false
                              ? this.setState({
                                  search_menu: true,
                                })
                              : this.setState({
                                  search_menu: false,
                                  search_results: false,
                                });
                          }}
                          style={{flex: 2}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: 'transparent',
                              borderColor:
                                this.state.search_menu === false
                                  ? 'white'
                                  : '#6C4DE6',
                              borderWidth: 2,
                              justifyContent: 'center',
                              padding: 3,
                              borderRadius: 100,
                              marginBottom: 10,
                            }}>
                            <Icon
                              name={'add-outline'}
                              size={24}
                              color={
                                this.state.search_menu === false
                                  ? 'white'
                                  : '#6C4DE6'
                              }
                            />
                            <Text
                              style={{
                                color:
                                  this.state.search_menu === false
                                    ? 'white'
                                    : '#6C4DE6',
                              }}>
                              Ajouter un titre
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={{flex: 1}} />
                      </View>
                      {this.state.search_menu ? (
                        <SearchMenu
                          onChangeText={this._search_results}
                          search={this.state.search}
                        />
                      ) : null}
                      {this.state.search_results ? (
                        <LinearGradient
                          colors={['#1E2732', '#1E2732']}
                          style={{
                            marginTop: 0,
                            padding: 0,
                            marginTop: 10,
                            paddingTop: 15,
                            paddingBottom: 50,
                          }}>
                          <View
                            style={{
                              padding: 0,
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flex: 1,
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 24,
                              }}>
                              Recherche pour {this.state.search}
                            </Text>
                            <FlatList
                              data={this.state.search_results}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={(item, key) => (
                                <TrackItem
                                  track={item?.item}
                                  album={item?.item.album}
                                  type={'playlist_recommendation'}
                                  playlist_id={this.state.playlist?.id}
                                  onReload={() => this._store_playlist()}
                                  onLongPress={() => {
                                    alert('test');
                                  }}
                                />
                              )}
                            />
                          </View>
                        </LinearGradient>
                      ) : null}
                    </>
                  ) : null
                }
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
                      onReload={() => this._store_playlist()}
                      onLongPress={this.props.onLongPress}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null}
          </Animated.View>
          {this.state.recommendations ? (
            <LinearGradient
              colors={['#1E2732', '#1E2732']}
              style={{
                marginTop: 0,
                padding: 0,
                paddingTop: 15,
                paddingBottom: 50,
              }}>
              <View
                style={{
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flex: 1,
                }}>
                <Text
                  style={{color: 'white', textAlign: 'center', fontSize: 24}}>
                  Nos Suggestions
                </Text>
                <FlatList
                  data={this.state.recommendations?.tracks}
                  keyExtractor={(item, index) => index.toString()}
                  style={{paddingBottom: 60}}
                  renderItem={(item, key) => (
                    <TrackItem
                      track={item.item}
                      album={item.item.album}
                      type={'playlist_recommendation'}
                      playlist_id={this.state.playlist?.id}
                      onReload={() => this._store_playlist()}
                      onLongPress={() => {
                        alert('test');
                      }}
                    />
                  )}
                />
              </View>
            </LinearGradient>
          ) : null}
          {this.state.related_playlist ? (
            <LinearGradient
              colors={['#1E2732', '#1E2732']}
              style={{
                marginTop: 0,
                padding: 0,
                paddingTop: 15,
                paddingBottom: 120,
              }}>
              <View
                style={{
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flex: 1,
                }}>
                <Text
                  style={{color: 'white', textAlign: 'center', fontSize: 24}}>
                  Nos Suggestions
                </Text>
                <FlatList
                  data={this.state.related_playlist?.items}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  renderItem={(item, key) => <Playlist playlist={item.item} />}
                />
              </View>
            </LinearGradient>
          ) : null}
        </Animated.ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          hardwareAccelerated={true}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: Dimensions.get('screen').width,
              backgroundColor: '#7856FF',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              paddingVertical: 50,
            }}>
            <TouchableOpacity
              onPress={() => this.setState({modalVisible: false})}
              style={{position: 'absolute', top: 10, right: 10}}>
              <Icon name={'close'} size={24} color={'white'} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              Voir les informations de la playlist
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                width: Dimensions.get('screen').width - 40,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 10,
              }}>
              <Image
                source={{uri: this.state.owner?.images[0]?.url}}
                style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
              />
              <Text>
                {this.state.playlist?.owner?.display_name}
              </Text>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2732',
  },
});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(PlaylistScreen);
