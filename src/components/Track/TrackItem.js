import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Liked from './Liked';
import Collab from './Collab';
import {Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import SpotifyWebApi from 'spotify-web-api-node';
import BottomDrawer from 'react-native-bottom-drawer-view';

const spotifyApi = new SpotifyWebApi();

class TrackItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      track: props.track,
      isCollab: false,
      added_to_queue: false,
      added_to_playlist: false,
    };
    this.swipeableRef = React.createRef();
    spotifyApi.setAccessToken(props.store.authentication.accessToken);
  }

  _set_offset = (disc_number, track_number) => {
    let offset = 0;
    while (disc_number > 0) {
      offset += this.props.disks[disc_number - 1]?.data?.length ?? 0;
      disc_number--;
    }
    return offset + track_number;
  };

  _play = (uri, track_number, disc_number = 1) => {
    Vibration.vibrate(10);
    let offset = 0,
      body = {};
    if (this.props.type === 'album') {
      offset = this._set_offset(disc_number, track_number);
    }
    if (this.props.type === 'album') {
      body = {
        context_uri: uri,
        offset: {
          position: offset - 1,
        },
        position_ms: 0,
      };
    } else if (this.props.type === 'playlist') {
      body = {
        context_uri: this.props.playlist_uri,
        offset: {
          position: this.props.playlist_index,
        },
        position_ms: 0,
      };
    } else {
      body = {
        uris: [uri],
        offset: {
          position: offset - 1,
        },
        position_ms: 0,
      };
    }

    fetch('https://api.spotify.com/v1/me/player/play', {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }).catch(e => {
      alert(JSON.stringify(e));
    });
  };

  _find_user = id => {
    return this.props.collab_users?.users_array.find(item => item?.id === id);
  };

  componentDidMount() {}

  _renderLeftActions = (progress, dragX) => {
    return (
      <View
        style={{
          height: 48,
          width: 48,
          backgroundColor: this.state.added_to_queue ? 'green' : 'purple',
          margin: 10,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name={this.state.added_to_queue ? 'check' : 'list'}
          size={24}
          color="white"
          style={{marginRight: 0, fontWeight: 'bold'}}
        />
      </View>
    );
  };

  _add_to_queue = () => {
    this.setState({added_to_queue: true});
    fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=${this.state.track.uri}`,
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
    setTimeout(() => {
      this.swipeableRef.current.close();
      setTimeout(() => {
        this.setState({added_to_queue: false});
      }, 200);
    }, 200);
  };

  _renderRightActions = (progress, dragX) => {
    return (
      <View
        style={{
          height: 48,
          width: 48,
          backgroundColor: 'transparent',
          margin: 10,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name={'trash'}
          size={24}
          color="red"
          style={{marginRight: 0, fontWeight: 'bold'}}
        />
      </View>
    );
  };

  _renderRightLibraryActions = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._renderMoreMenu();
        }}
        style={{
          height: 48,
          width: 48,
          backgroundColor: 'transparent',
          margin: 10,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name={'more-vertical'}
          size={24}
          color="#7856FF"
          style={{marginRight: 0, fontWeight: 'bold'}}
        />
      </TouchableOpacity>
    );
  };

  add_to_playlist = (playlist_id, uri) => {
    fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${uri}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    ).then(data => {
      this.setState({added_to_playlist: data.ok});
      this.props.onReload();
    });
  };

  _onLongPressAction = () => {
    this.props.onLongPress(this.state.track?.uri);
    setTimeout(() => {
      this.swipeableRef.current.close();
    }, 200);
  };

  _renderMoreMenu = () => {
    this.swipeableRef.current.close();
  };

  render() {
    return this.state.added_to_playlist ? null : (
      <View>
        {/*<Swipeable*/}
        {/*  ref={this.swipeableRef}*/}
        {/*  failOffsetX={20}*/}
        {/*  overshootLeft={false}*/}
        {/*  overshootRight={false}*/}
        {/*  overshootFriction={4}*/}
        {/*  friction={2}*/}
        {/*  renderLeftActions={this._renderLeftActions}*/}
        {/*  onSwipeableLeftOpen={() => this._add_to_queue()}*/}
        {/*  onSwipeableRightOpen={() =>*/}
        {/*    this.props.type === 'playlist' ? this._onLongPressAction() : null*/}
        {/*  }>*/}
        <TouchableOpacity
          onLongPress={() => this.props.onLongPress(this.state.track?.uri)}
          onPress={() => {
            this._play(
              this.props.type === 'album'
                ? this.props.album?.uri
                : this.props.type === 'playlist' ||
                  this.props.type === 'playlist_recommendation'
                ? this.state.track?.uri
                : this.state.track?.uri,
              this.state.track?.track_number,
              this.state.track?.disc_number,
            );
            this.props.onPress();
          }}>
          <View
            style={{
              padding: 0,
              margin: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: Dimensions.get('screen').width - 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                elevation: 5,
              }}>
              <Image
                source={{uri: this.props.album?.images[2]?.url}}
                style={{width: 50, height: 50, borderRadius: 10}}
              />
            </View>
            <View
              style={{
                marginLeft: 10,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: 10,
              }}>
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color:
                      this.props.store.listening?.listening?.item?.id ===
                      this.state.track?.id
                        ? this.props.colorAlt
                          ? 'white'
                          : '#7856FF'
                        : 'white',
                    maxWidth: (Dimensions.get('screen').width / 3) * 1.7,
                  }}
                  numberOfLines={1}>
                  {this.state.track?.name}
                </Text>
                <FlatList
                  data={this.state.track?.artists}
                  scrollEnabled={true}
                  horizontal={true}
                  ItemSeparatorComponent={() => (
                    <Text
                      style={{
                        color:
                          this.props.store.listening.listening?.item?.id ===
                          this.state.track?.id
                            ? this.props.colorAlt
                              ? 'white'
                              : '#7856FF'
                            : 'white',
                      }}>
                      ,{' '}
                    </Text>
                  )}
                  renderItem={({item, key}) => (
                    <Text
                      style={{
                        color:
                          this.props.store.listening?.listening?.item?.id ===
                          this.state.track?.id
                            ? this.props.colorAlt
                              ? 'white'
                              : '#7856FF'
                            : 'white',
                      }}>
                      {item.name}
                    </Text>
                  )}
                  contentContainerStyle={{
                    maxWidth: Dimensions.get('screen').width / 1.9,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Collab collab={this._find_user(this.props.added_by?.id)} />
                {this.props.type === 'playlist_recommendation' ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.add_to_playlist(
                        this.props.playlist_id,
                        this.props.track.uri,
                      );
                    }}>
                    {this.state.added_to_playlist ? (
                      <Icon
                        name="plus"
                        size={this.props.iconSize ?? 24}
                        color={'green'}
                        style={'green'}
                      />
                    ) : (
                      <Icon
                        name="plus"
                        size={this.props.iconSize ?? 24}
                        solid={!!this.state.liked}
                        color={this.state.liked ? '#7856FF' : 'white'}
                        style={{
                          color: this.state.liked ? '#7856FF' : 'white',
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <Liked track={this.state.track} />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/*</Swipeable>*/}
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(TrackItem);
