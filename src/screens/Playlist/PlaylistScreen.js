import axios from 'axios';
import React from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {Extrapolate} from 'react-native-reanimated';
import {connect} from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';
import Header from '../../components/Playlist/Header';

class PlaylistScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: null,
      scrollY: new Animated.Value(0),
      englithment: null,
      recommendations: false,
    };
  }

  /**
   *
   * @returns {Promise<AxiosResponse<any>>}
   * @private
   */
  _get_playlist = () => {
    const promise = axios.get(
      'https://api.spotify.com/v1/playlists/' +
        this.props.route.params.playlist_id,
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
   * @param {Object} json
   * @private
   */
  _get_recommended_playlists = json => {
    let tracksId = this._format_ids(json, 'tracks');
    let artistsId = this._format_ids(json, 'artists');
    const promise = axios.get(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${artistsId}&seed_genres=*&seed_tracks=${tracksId}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    promise.then(data => this.setState({recommendations: data.data}));
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
      `https://api.spotify.com/v1/recommendations?seed_tracks=${this.state.playlist.tracks.items[0].track.id}&limit=10`,
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
    const promise = axios.get(`${href}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
    });
    return promise.then(data => data.data);
  };

  componentDidMount() {
    const opacity = this.state.scrollY.interpolate({
      inputRange: [250, 325],
      outputRange: [0, 0.5],
      extrapolate: Extrapolate.CLAMP,
    });
    this._store_playlist();
  }

  _store_playlist = () => {
    this._get_playlist().then(json => {
      this.setState({playlist: json});
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
          ...prevState,
          playlist: {
            ...prevState.playlist,
            collab_users: {
              users_array,
            },
          },
        }));
      }
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
          {...this.props}
        />
        <Animated.ScrollView
          style={{zIndex: 98}}
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
                ListHeaderComponent={() => (
                  <View style={{marginHorizontal: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.state.recommendations == false
                          ? this._enlight_playlist().then(data =>
                              this.setState({
                                recommendations: data,
                              }),
                            )
                          : this.setState({
                              recommendations: false,
                            })
                      }>
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
                          name={'zap'}
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
                  </View>
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
                      onReload={() => this._store_playlist()}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null}
          </Animated.View>
          <LinearGradient
            colors={['#1E2732', '#1E2732']}
            style={{
              marginTop: 0,
              padding: 0,
              paddingTop: 15,
              paddingBottom: 50,
            }}>
            {this.state.recommendations ? (
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
                  renderItem={(item, key) => (
                    <TrackItem
                      track={item.item}
                      album={item.item.album}
                      type={'playlist_recommendation'}
                      playlist_id={this.state.playlist?.id}
                      onReload={() => this._store_playlist()}
                    />
                  )}
                />
              </View>
            ) : null}
          </LinearGradient>
        </Animated.ScrollView>
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
