import React, {useEffect} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  UIManager,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as rootNavigation from '../../utils/RootNavigation';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Feather';
import Liked from '../Track/Liked';
import axios from 'axios';
import {connect} from 'react-redux';
import SeekBar from './Player/Seek';
import TrackItem from '../Track/TrackItem';
import AlbumItemWithOffset from '../Album/AlbumItemWithOffset';
import listeningHandler from '../../utils/listeningHandler';
import {
  refreshListening,
  setListening,
} from '../../redux/features/listening/listeningSlice';
import SpotifyWebApi from 'spotify-web-api-node';

const SpotifyApi = new SpotifyWebApi();

class PlayerAlt extends React.Component {
  constructor(props) {
    super(props);
    SpotifyApi.setAccessToken(this.props.store.authentication.accessToken);
    this.state = {
      listening: null,
      devices: null,
      paroles: false,
      big: false,
      current_progress: 0,
      time_iteration: 0,
      play: null,
      shuffle: null,
      repeat: null,
      device_menu: {
        big: false,
        top: new Animated.Value(Dimensions.get('screen').height),
        bottom: 0,
        left: 0,
        right: 0,
        height: new Animated.Value(0),
      },
      waiting_list: {
        big: false,
        top: new Animated.Value(Dimensions.get('screen').height),
        bottom: 0,
        left: 0,
        right: 0,
        height: new Animated.Value(0),
      },
      track_infos: {
        big: false,
        top: new Animated.Value(Dimensions.get('screen').height),
        bottom: 0,
        left: 0,
        right: 0,
        height: new Animated.Value(0),
      },
      share_menu: {
        big: false,
        top: new Animated.Value(Dimensions.get('screen').height),
        bottom: 0,
        left: 0,
        right: 0,
        height: new Animated.Value(0),
      },
      player: {
        bottom: new Animated.Value(52),
        left: new Animated.Value(5),
        right: new Animated.Value(5),
        top: new Animated.Value(Dimensions.get('screen').height - 112),
        padding: new Animated.Value(0),
        track_image: {
          height: new Animated.Value(40),
          width: new Animated.Value(40),
          flex: new Animated.Value(1),
        },
        track_controls: {
          display: 'flex',
        },
        track_infos: {
          flexDirection: 'row',
          flexType: 'flex-start',
          fontSize: 14,
        },
      },
    };
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }

  _get_listening = () => {
    setInterval(() => {
      SpotifyApi.getMyCurrentPlayingTrack().then(data => {
        if (data.body) {
          this.setState({
            listening: data.body,
            play: data.body.is_playing,
            shuffle: data.body.shuffle_state,
            repeat: data.body.repeat_state,
          });
        }
        if (data.error) {
          alert(data.error);
        }
      });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this._get_listening);
  }

  _like = () => {
    Vibration.vibrate(10);
    if (this.state.listening) {
      if (this.state.listening.item) {
        if (this.state.listening.item.is_liked) {
          SpotifyApi.removeFromMySavedTracks([
            this.state.listening.item.id,
          ]).then(() =>
            this.setState({
              listening: {
                ...this.state.listening,
                item: {...this.state.listening.item, is_liked: false},
              },
            }),
          );
        } else {
          SpotifyApi.addToMySavedTracks([this.state.listening.item.id]).then(
            () =>
              this.setState({
                listening: {
                  ...this.state.listening,
                  item: {...this.state.listening.item, is_liked: true},
                },
              }),
          );
        }
      }
    }
  };

  /**
   *
   * @returns {boolean}
   */
  handleBackButton = () => {
    if (this.state.big) {
      this._deploy_big_player();
      return false;
    }
    return false;
  };

  /**
   *
   * @private
   */
  _deploy_big_player = () => {
    if (this.state.big) {
      Animated.spring(this.state.player.bottom, {
        toValue: 52,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.top, {
        toValue: Dimensions.get('screen').height - 112,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.left, {
        toValue: 3,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.right, {
        toValue: 3,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.padding, {
        toValue: 0,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      Animated.spring(this.state.player.track_image.height, {
        toValue: 40,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      Animated.spring(this.state.player.track_image.width, {
        toValue: 40,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      Animated.spring(this.state.player.track_image.flex, {
        toValue: 1,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      this.setState(prevState => ({
        player: {
          ...prevState.player,
          track_controls: {
            display: 'flex',
          },
          track_infos: {
            flexDirection: 'row',
            flexType: 'flex-start',
            fontSize: 14,
          },
        },
      }));
    } else {
      Animated.spring(this.state.player.bottom, {
        toValue: 0,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.top, {
        toValue: 0,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.left, {
        toValue: 0,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.right, {
        toValue: 0,
        useNativeDriver: false,
        overshootClamping: true,
      }).start();
      Animated.spring(this.state.player.padding, {
        toValue: StatusBar.currentHeight,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      Animated.spring(this.state.player.track_image.height, {
        toValue: Dimensions.get('screen').width - 20,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      Animated.spring(this.state.player.track_image.width, {
        toValue: Dimensions.get('screen').width - 20,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      Animated.spring(this.state.player.track_image.flex, {
        toValue: 1,
        useNativeDriver: false,
        overshootClamping: false,
      }).start();
      this.setState(prevState => ({
        player: {
          ...prevState.player,
          track_controls: {
            display: 'none',
          },
          track_infos: {
            flexDirection: 'row',
            flexType: 'flex-start',
            fontSize: 25,
          },
        },
      }));
    }
    this.setState({
      big: !this.state.big,
    });
  };

  componentDidMount() {
    this._get_listening();
  }

  /**
   * Pause the player
   * @private
   */
  _pause = () => {
    SpotifyApi.pause(() => this.setState({play: false}));
    // fetch('https://api.spotify.com/v1/me/player/pause', {
    //   headers: {
    //     Accept: 'application/json',
    //     Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'PUT',
    // });
    // this.setState({play: false});
  };

  /**
   * Resume the player
   * @private
   */
  _play = () => {
    SpotifyApi.play();
  };

  /**
   * Skip to next track
   * @private
   */
  _next = () => {
    SpotifyApi.skipToNext();
  };

  /**
   * Skip to previous track
   * @private
   */
  _prev = () => {
    SpotifyApi.skipToPrevious();
  };

  /**
   * Seek the player to a position or to the start of the track
   * @param position
   * @private
   */
  _seek = position => {
    SpotifyApi.seek(position);
  };

  /**
   * Enable the shuffling state
   * @private
   */
  _shuffle = () => {
    SpotifyApi.setShuffle(!this.state.shuffle);
    this.forceStateRefresh();
  };

  /**
   * Enable the repeat state
   * @private
   */
  _repeat = () => {
    SpotifyApi.setRepeat(
      this.state.repeat === 'context'
        ? 'track'
        : this.state.repeat === 'track'
        ? 'off'
        : this.state.repeat === 'off'
        ? 'context'
        : null,
    );
    this.forceStateRefresh();
  };

  /**
   * Display the icon for the current device used by the player
   * @param device_type
   * @returns {string}
   * @private
   */
  _display_device_icon = device_type => {
    // alert(device_type);
    if (device_type === 'Smartphone') {
      return 'smartphone';
    } else if (device_type === 'Speaker') {
      return 'speaker';
    } else if (device_type === 'Computer') {
      return 'hard-drive';
    } else {
      return 'smartphone';
    }
  };

  /**
   * Deploy the device menu
   * @private
   */
  _deploy_devices_menu = () => {
    if (this.state.device_menu.big) {
      Animated.spring(this.state.device_menu.top, {
        toValue: Dimensions.get('screen').height,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.device_menu.height, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      this._get_available_devices();
      Animated.spring(this.state.device_menu.top, {
        toValue: Dimensions.get('screen').height / 2,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.device_menu.height, {
        toValue: Dimensions.get('screen').height / 2,
        useNativeDriver: false,
      }).start();
    }
    this.setState(prevState => ({
      ...prevState,
      device_menu: {
        ...prevState.device_menu,
        big: !this.state.device_menu.big,
      },
    }));
  };
  /**
   * Deploy the waiting menu
   * @private
   */
  _deploy_waiting_list = () => {
    if (this.state.waiting_list.big) {
      Animated.spring(this.state.waiting_list.top, {
        toValue: Dimensions.get('screen').height,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.waiting_list.height, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(this.state.waiting_list.top, {
        toValue: Dimensions.get('screen').height * 0,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.waiting_list.height, {
        toValue: Dimensions.get('screen').height * 1,
        useNativeDriver: false,
      }).start();
    }

    this.setState(prevState => ({
      ...prevState,
      waiting_list: {
        ...prevState.waiting_list,
        big: !this.state.waiting_list.big,
      },
    }));
  };
  /**
   * Deploy the share menu
   * @private
   */
  _deploy_share_menu = () => {
    if (this.state.share_menu.big) {
      Animated.spring(this.state.share_menu.top, {
        toValue: Dimensions.get('screen').height,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.share_menu.height, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(this.state.share_menu.top, {
        toValue: Dimensions.get('screen').height * 0,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.share_menu.height, {
        toValue: Dimensions.get('screen').height * 1,
        useNativeDriver: false,
      }).start();
    }
    this.setState(prevState => ({
      ...prevState,
      share_menu: {
        ...prevState.share_menu,
        big: !this.state.share_menu.big,
      },
    }));
  };
  /**
   * Deploy the track info menu
   * @private
   */
  _deploy_track_infos = () => {
    if (this.state.track_infos.big) {
      Animated.spring(this.state.track_infos.top, {
        toValue: Dimensions.get('screen').height,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.track_infos.height, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(this.state.track_infos.top, {
        toValue: Dimensions.get('screen').height * 0,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.track_infos.height, {
        toValue: Dimensions.get('screen').height * 1,
        useNativeDriver: false,
      }).start();
    }
    this.setState(prevState => ({
      ...prevState,
      track_infos: {
        ...prevState.track_infos,
        big: !this.state.track_infos.big,
      },
    }));
  };
  /**
   * Fetch all available devices
   * @private
   */
  _get_available_devices = () => {
    SpotifyApi.getMyDevices().then(data => {
      let devices = this._check_current_device(data.body.devices);
      this.setState(prevState => ({
        ...prevState,
        devices: devices,
      }));
    });
  };
  /**
   * Check if the current device is in the list of available devices
   * @param devices
   * @returns {{active: {}, list: []}}
   * @private
   */
  _check_current_device = devices => {
    let to_return = {
      active: {},
      list: [],
    };
    devices.map(item => {
      if (item.is_active) {
        to_return.active = item;
      } else {
        to_return.list.push(item);
      }
    });
    return to_return;
  };
  /**
   * Switch the playing context to another device
   * @param device_id
   * @returns {Promise<void>}
   * @private
   */
  _transfer_playback = async device_id => {
    await SpotifyApi.transferMyPlayback([device_id]).finally(() => {
      this._get_available_devices();
    });
  };

  /**
   * Deploy the external share menu
   * @param customOptions
   * @returns {Promise<void>}
   */
  single_share = async customOptions => {
    try {
      await Share.shareSingle(customOptions);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return this.state?.listening ? (
      <Animated.View
        style={{
          position: 'absolute',
          bottom: this.state.player.bottom,
          left: this.state.player.left,
          right: this.state.player.right,
          top: this.state.player.top,
          backgroundColor: '#6C4DE6',
          borderRadius: 10,
          paddingTop: this.state.player.padding,
        }}>
        <LinearGradient
          colors={['#6C4DE6', '#6C4DE6']}
          style={{borderRadius: 10}}>
          <TouchableOpacity
            onPress={() => (this.state.big ? null : this._deploy_big_player())}
            disabled={this.state.big}>
            <ScrollView style={{padding: 10}}>
              {this.state.big ? (
                <View
                  style={{
                    flex: 1,
                    width: Dimensions.get('screen').width - 20,
                    minHeight: 50,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                  }}>
                  <TouchableOpacity onPress={() => this._deploy_big_player()}>
                    <Icon name={'chevron-down'} size={24} color={'white'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this._deploy_track_infos()}>
                    <Icon name={'menu'} size={24} color={'white'} />
                  </TouchableOpacity>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexWrap: this.state.big ? 'wrap' : 'nowrap',
                  maxHeight: Dimensions.get('screen').height,
                }}>
                <Animated.View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flex: 1,
                    flexWrap: this.state.big ? 'wrap' : 'nowrap',
                    elevation: 10,
                  }}>
                  <Animated.View
                    style={{
                      width: this.state.player.track_image.width ?? 40,
                      height: this.state.player.track_image.height ?? 40,
                      shadowOffset: {width: 10, height: 10},
                      shadowColor: '#000',
                      shadowOpacity: 1,
                      elevation: 10,
                      borderRadius: 10,
                      overflow: 'visible',
                    }}>
                    <Animated.Image
                      source={{
                        uri: this.state?.listening?.item?.album?.images[0]?.url,
                      }}
                      style={{
                        minWidth: this.state.player.track_image.width ?? 40,
                        minHeight: this.state.player.track_image.height ?? 40,
                        maxWidth: this.state.player.track_image.width,
                        maxHeight: this.state.player.track_image.height,
                        margin: 'auto',
                        borderRadius: 10,
                        flex: this.state.player.track_image.flex,
                      }}
                    />
                  </Animated.View>
                  <Animated.View
                    style={{
                      flex: 6,
                      minWidth: this.state.big
                        ? Dimensions.get('screen').width - 20
                        : 'auto',
                      maxWidth: this.state.big
                        ? Dimensions.get('screen').width - 20
                        : 'auto',
                      marginTop: this.state.big ? 25 : 0,
                      minHeight: this.state.big
                        ? Dimensions.get('screen').height - 20
                        : 40,
                      maxHeight: this.state.big
                        ? Dimensions.get('screen').height - 20
                        : 40,
                    }}>
                    <Animated.View
                      style={{
                        marginLeft: 5,
                        flexDirection: this.state.big ? 'row' : 'row',
                        alignItems: 'center',
                        justifyContent: this.state.big
                          ? 'space-between'
                          : 'flex-start',
                        fontSize: this.state.player.track_infos.fontSize,
                      }}>
                      <Animated.View
                        style={{
                          flexDirection: this.state.big ? 'column' : 'row',
                          alignItems: this.state.big ? 'flex-start' : 'center',
                          justifyContent: 'flex-start',
                          flex: 1,
                          maxWidth: this.state.big ? '100%' : '90%',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: this.state.player.track_infos.fontSize,
                            maxWidth: this.state.big ? '90%' : '100%',
                          }}
                          numberOfLines={1}>
                          {this.state?.listening?.item?.name}
                        </Text>
                        {!this.state.big ? (
                          <Icon
                            name={'circle'}
                            size={5}
                            style={{marginHorizontal: 5}}
                          />
                        ) : null}
                        {this.state.big ? (
                          <FlatList
                            data={this.state?.listening?.item?.artists}
                            horizontal={true}
                            contentContainerStyle={{maxWidth: '90%'}}
                            ItemSeparatorComponent={() => (
                              <Icon
                                name={'circle'}
                                size={5}
                                style={{
                                  marginHorizontal: 5,
                                  alignSelf: 'center',
                                }}
                              />
                            )}
                            renderItem={({item, key}) => (
                              <TouchableOpacity
                                onPress={() => {
                                  rootNavigation.push('Artist', {
                                    artist_id: item.id,
                                  });
                                  setTimeout(() => {
                                    this.state.big
                                      ? this._deploy_big_player()
                                      : null;
                                  }, 500);
                                }}>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontSize:
                                      this.state.player.track_infos.fontSize -
                                      (this.state.big ? 4 : 0),
                                  }}
                                  numberOfLines={1}>
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              rootNavigation.navigate('Artist', {
                                artist_id:
                                  this.state?.listening?.item?.artists[0].id,
                              });
                              setTimeout(() => {
                                this.state.big
                                  ? this._deploy_big_player()
                                  : null;
                              }, 500);
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize:
                                  this.state.player.track_infos.fontSize -
                                  (this.state.big ? 4 : 0),
                              }}
                              numberOfLines={1}>
                              {this.state?.listening?.item?.artists[0]?.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </Animated.View>
                      {this.state.big ? (
                        <View style={{flexDirection: 'row'}}>
                          <Liked
                            track={this.state?.listening?.item}
                            iconSize={this.state.big ? 24 : 24}
                          />
                          {this.state?.listening?.actions?.disallows
                            ?.toggling_repeat_context &&
                          this.state?.listening?.actions?.disallows
                            ?.toggling_repeat_track &&
                          this.state?.listening?.actions?.disallows
                            ?.toggling_shuffle ? (
                            <TouchableOpacity
                              onPress={() => alert('not liked')}
                              style={{marginLeft: 10}}>
                              <Icon name={'slash'} size={24} color={'white'} />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null}
                    </Animated.View>
                    {!this.state.big ? (
                      <View
                        style={{
                          marginLeft: 5,
                          flexDirection: 'row',
                          marginTop: 2,
                          alignItems: 'center',
                        }}>
                        <Icon
                          name={this._display_device_icon(
                            this.state?.listening?.device?.type,
                          )}
                          size={16}
                          style={{color: 'white', fontWeight: 'bold'}}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            color: 'white',
                            fontWeight: 'bold',
                          }}>
                          {this.state?.listening?.device?.name}
                        </Text>
                      </View>
                    ) : null}
                  </Animated.View>
                </Animated.View>
                {this.state.big ? (
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      height: Dimensions.get('screen').height / 4,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        width: Dimensions.get('screen').width - 20,
                      }}>
                      <SeekBar
                        trackLength={
                          !isNaN(
                            this.state?.listening?.item?.duration_ms / 1000,
                          )
                            ? this.state?.listening?.item?.duration_ms / 1000
                            : 10
                        }
                        currentPosition={
                          !isNaN(this.state?.listening?.progress_ms / 1000)
                            ? this.state?.listening?.progress_ms / 1000
                            : 0
                        }
                        onSeek={this._seek}
                      />
                    </View>
                    <View
                      style={{
                        width: Dimensions.get('screen').width - 20,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <TouchableOpacity
                        onPress={() => this._shuffle()}
                        disabled={
                          this.state?.listening.actions.disallows
                            .toggling_shuffle
                        }>
                        <Icon
                          name="shuffle"
                          size={24}
                          style={{
                            color: this.state.shuffle ? 'green' : 'white',
                            opacity: this.state?.listening.actions.disallows
                              .toggling_shuffle
                              ? 0.2
                              : 1,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._prev()}>
                        <Icon
                          name="skip-back"
                          size={this.state.big ? 36 : 24}
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            color: 'white',
                          }}
                        />
                      </TouchableOpacity>
                      {this.state.play ? (
                        <TouchableOpacity
                          onPress={() => {
                            this._pause();
                          }}>
                          <Icon
                            name="pause"
                            size={this.state.big ? 48 : 24}
                            style={{
                              marginLeft: 10,
                              marginRight: 0,
                              color: 'white',
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this._play();
                          }}>
                          <Icon
                            name="play"
                            size={this.state.big ? 48 : 24}
                            style={{
                              marginLeft: 10,
                              marginRight: 0,
                              color: 'white',
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => this._next()}>
                        <Icon
                          name="skip-forward"
                          size={this.state.big ? 36 : 24}
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            color: 'white',
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this._repeat()}
                        disabled={
                          this.state?.listening.actions.disallows
                            .toggling_repeat_track ||
                          this.state?.listening.actions.disallows
                            .toggling_repeat_context
                        }>
                        <Icon
                          name="repeat"
                          size={24}
                          style={{
                            color:
                              this.state.repeat === 'track'
                                ? '#7856FF'
                                : this.state.repeat === 'context'
                                ? 'green'
                                : 'white',
                            opacity:
                              this.state?.listening.actions.disallows
                                .toggling_repeat_track ||
                              this.state?.listening.actions.disallows
                                .toggling_repeat_context
                                ? 0.2
                                : 1,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        width: Dimensions.get('screen').width - 20,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => this._deploy_devices_menu()}
                        style={{
                          marginLeft: 5,
                          flexDirection: 'row',
                          marginTop: 2,
                          alignItems: 'center',
                          flex: 2,
                        }}>
                        <Icon
                          name={this._display_device_icon(
                            this.state?.listening?.device?.type,
                          )}
                          size={24}
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft: 15,
                          }}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            color: 'white',
                            fontWeight: 'bold',
                          }}>
                          {this.state?.listening?.device?.name}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flex: 2,
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          marginRight: 15,
                        }}>
                        {/*<TouchableOpacity*/}
                        {/*  onPress={() => this._deploy_share_menu()}>*/}
                        {/*  <Icon*/}
                        {/*    name="share"*/}
                        {/*    size={this.state.big ? 24 : 24}*/}
                        {/*    style={{*/}
                        {/*      marginLeft: 20,*/}
                        {/*      marginRight: 20,*/}
                        {/*      color: 'white',*/}
                        {/*    }}*/}
                        {/*  />*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity
                          onPress={() => this._deploy_waiting_list()}>
                          <Icon
                            name="list"
                            size={24}
                            style={{color: 'white'}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  <Animated.View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: this.state.big
                        ? 'space-between'
                        : 'flex-end',
                      minWidth: this.state.big
                        ? Dimensions.get('screen').width - 20
                        : 'auto',
                    }}>
                    <Icon
                      name="speaker"
                      size={this.state.big ? 48 : 24}
                      style={{marginLeft: 10, marginRight: 10}}
                    />
                    <Liked
                      track={this.state?.listening?.item}
                      iconSize={this.state.big ? 48 : 24}
                    />
                    {this.state.play ? (
                      <TouchableOpacity
                        onPress={() => {
                          this._pause();
                        }}>
                        <Icon
                          name="pause"
                          size={this.state.big ? 48 : 24}
                          style={{
                            marginLeft: 10,
                            marginRight: 0,
                            color: 'white',
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this._play();
                        }}>
                        <Icon
                          name="play"
                          size={this.state.big ? 48 : 24}
                          style={{
                            marginLeft: 10,
                            marginRight: 0,
                            color: 'white',
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </Animated.View>
                )}
              </View>
              {!this.state.big ? (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    width: '100%',
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    right: 0,
                  }}>
                  <View
                    style={{
                      height: 2,
                      backgroundColor: 'grey',
                      flex: 1,
                      alignSelf: 'center',
                      borderRadius: 5,
                    }}>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: 'white',
                        width:
                          (this.state?.listening?.progress_ms /
                            this.state?.listening?.item?.duration_ms) *
                            100 +
                          '%',
                        borderRadius: 5,
                      }}
                    />
                  </View>
                </View>
              ) : null}
              {/*	paroles*/}
              <View
                style={{
                  height: Dimensions.get('screen').height / 2,
                  width: Dimensions.get('screen').width - 20,
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: '#1E2732',
                  borderRadius: 10,
                }}>
                <Text style={{fontSize: 30, color: 'white', marginBottom: 15}}>
                  Lorem ipsum dolor sit amet.
                </Text>
                <Text style={{fontSize: 30, color: 'white', marginBottom: 15}}>
                  consectetur adipisicing elit. Quas, quibusdam.
                </Text>
                <Text style={{fontSize: 30, color: 'white', marginBottom: 15}}>
                  Lorem ipsum dolor sit amet.
                </Text>
                <Text style={{fontSize: 30, color: 'white', marginBottom: 15}}>
                  consectetur adipisicing elit. Quas, quibusdam.
                </Text>
                <Text style={{fontSize: 30, color: 'white', marginBottom: 15}}>
                  Lorem ipsum dolor sit amet.
                </Text>
                <Text style={{fontSize: 30, color: 'white', marginBottom: 15}}>
                  consectetur adipisicing elit. Quas, quibusdam.
                </Text>
              </View>
              {/*	//paroles */}
            </ScrollView>
          </TouchableOpacity>
        </LinearGradient>
        <Animated.View
          style={{
            position: 'absolute',
            top: this.state.device_menu.top,
            left: this.state.device_menu.left,
            right: this.state.device_menu.right,
            bottom: this.state.device_menu.bottom,
            height: this.state.device_menu.height,
            backgroundColor: '#7856FF',
            paddingTop: 10,
            flex: 1,
            borderRadius: 10,
            elevation: 10,
            shadowColor: '#000000',
          }}>
          <View
            style={{
              width: Dimensions.get('screen').width,
              height: 50,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              paddingHorizontal: 30,
            }}>
            <TouchableOpacity onPress={() => this._deploy_devices_menu()}>
              <Icon name={'x'} size={24} color={'white'} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, padding: 30}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Icon name={'music'} size={48} color={'white'} />
              <View style={{marginLeft: 20}}>
                <Text
                  style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>
                  Écoute en cours sur :
                </Text>
                <Text style={{color: 'white', fontSize: 18}}>
                  {this.state.devices?.active?.name}
                </Text>
              </View>
            </View>
            <Text style={{fontSize: 16, color: 'white', marginVertical: 10}}>
              Séléctionnez un appareil
            </Text>
            <FlatList
              data={this.state.devices?.list}
              renderItem={({item, key}) => (
                <TouchableOpacity
                  onPress={() => this._transfer_playback(item.id)}
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name={this._display_device_icon(item.type)}
                    size={48}
                    color={'white'}
                  />
                  <Text style={{fontSize: 16, marginLeft: 25}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            top: this.state.waiting_list.top,
            left: this.state.waiting_list.left,
            right: this.state.waiting_list.right,
            bottom: this.state.waiting_list.bottom,
            height: this.state.waiting_list.height,
            backgroundColor: '#B00D72',
            paddingTop: 0,
            flex: 1,
            borderRadius: 10,
            elevation: 10,
            shadowColor: '#000000',
          }}>
          <LinearGradient
            colors={['#7856FF', '#1E2732']}
            style={{paddingTop: StatusBar.currentHeight, flex: 1}}>
            <View
              style={{
                width: Dimensions.get('screen').width,
                height: 50,
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                paddingHorizontal: 30,
              }}>
              <TouchableOpacity onPress={() => this._deploy_waiting_list()}>
                <Icon name={'x'} size={24} color={'white'} />
              </TouchableOpacity>
            </View>
            {this.state.waiting_list.big ? (
              <View style={{elevation: 10, shadowColor: '#000'}}>
                <Text style={{marginLeft: 10, fontSize: 16, color: 'white'}}>
                  En cours de lecture :
                </Text>
                <TrackItem
                  track={this.state?.listening?.item}
                  album={this.state?.listening?.item?.album}
                  colorAlt={true}
                />
                {this.state?.listening?.context ? (
                  <Text
                    style={{
                      marginLeft: 10,
                      marginBottom: 10,
                      fontSize: 16,
                      color: 'white',
                    }}>
                    Prochains titres{' '}
                    {this.state.context?.type == 'album'
                      ? 'de ' + this.state?.listening?.item?.album?.name
                      : null}{' '}
                    :{' '}
                  </Text>
                ) : null}
              </View>
            ) : null}
            <View style={{elevation: 10}}>
              {this.state.waiting_list.big ? (
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  {this.state?.listening.context ? (
                    <AlbumItemWithOffset
                      context={this.state?.listening?.context}
                      listening={this.state?.listening}
                    />
                  ) : null}
                </View>
              ) : null}
            </View>
          </LinearGradient>
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            top: this.state.share_menu.top,
            left: this.state.share_menu.left,
            right: this.state.share_menu.right,
            bottom: this.state.share_menu.bottom,
            height: this.state.share_menu.height,
            backgroundColor: '#B00D72',
            flex: 1,
            borderRadius: 10,
            elevation: 10,
            shadowColor: '#000000',
          }}>
          <LinearGradient
            colors={['#7856FF', '#1E2732']}
            style={{
              flex: 1,
              borderRadius: 10,
              paddingTop: StatusBar.currentHeight,
            }}>
            <View
              style={{
                width: Dimensions.get('screen').width,
                height: 50,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 30,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                Partager
              </Text>
              <TouchableOpacity onPress={() => this._deploy_share_menu()}>
                <Icon name={'x'} size={24} color={'white'} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, padding: 30}}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View
                  style={{
                    elevation: 10,
                    backgroundColor: '#1E2732',
                    borderRadius: 10,
                    marginVertical: 30,
                  }}>
                  <View
                    style={{
                      height: Dimensions.get('screen').width / 2,
                      width: Dimensions.get('screen').width / 2,
                      elevation: 10,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: 'black',
                        elevation: 10,
                        borderRadius: 10,
                      }}>
                      <Image
                        source={{
                          uri: this.state?.listening?.item?.album?.images[1]
                            ?.url,
                        }}
                        style={{...StyleSheet.absoluteFill, borderRadius: 10}}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      width: Dimensions.get('screen').width / 2,
                      backgroundColor: '#1E2732',
                      padding: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        textAlign: 'center',
                      }}>
                      {this.state?.listening?.item?.name}
                    </Text>
                    <FlatList
                      data={this.state?.listening?.item?.artists}
                      renderItem={({item, key}) => (
                        <TouchableOpacity
                          onPress={() => {
                            rootNavigation.push('Artist', {
                              artist_id: item.id,
                            });
                            setTimeout(() => {
                              this.state.big ? this._deploy_big_player() : null;
                              this.state.share_menu.big
                                ? this._deploy_share_menu()
                                : null;
                            }, 500);
                          }}>
                          <Text
                            style={{
                              marginTop: 2,
                              fontSize: 12,
                              textAlign: 'center',
                            }}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={() => <Text>, </Text>}
                      horizontal={true}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 30,
                  flexWrap: 'wrap',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('pressed')}
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/facebook.png',
                      }}
                      style={{...StyleSheet.absoluteFill, borderRadius: 48}}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>Copier le lien</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('pressed')}
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/whatsapp.png',
                      }}
                      style={{...StyleSheet.absoluteFill, borderRadius: 48}}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>Whatsapp</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('pressed')}
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/instagram.png',
                      }}
                      style={{...StyleSheet.absoluteFill, borderRadius: 48}}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>Stories</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('pressed')}
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/messenger.png',
                      }}
                      style={{...StyleSheet.absoluteFill, borderRadius: 48}}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>Messenger</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                  flexWrap: 'wrap',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('pressed')}
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                      borderColor: '#3B579D',
                      borderWidth: 2,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/facebook.png',
                      }}
                      style={{
                        ...StyleSheet.absoluteFill,
                        borderRadius: 48,
                        borderWidth: 2,
                        borderColor: '#1E2732',
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>Stories</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      Share.share(
                        {
                          title: `${this.state?.listening?.item?.name} - ${this.state?.listening?.item?.artists[0]?.name}`,
                          // message: `${this.state?.listening?.item?.external_urls?.spotify}`,
                          message:
                            'Zik_mu://track/' + this.state?.listening?.item?.id,
                          url: 'https://flexcorp-dev.fr',
                        },
                        {
                          dialogTitle: `${this.state?.listening?.item?.name} - ${this.state?.listening?.item?.artists[0]?.name}`,
                        },
                      )
                    }
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/twitter.png',
                      }}
                      style={{...StyleSheet.absoluteFill, borderRadius: 48}}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>Twitter</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('pressed')}
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/snapchat.png',
                      }}
                      style={{...StyleSheet.absoluteFill, borderRadius: 48}}
                    />
                  </TouchableOpacity>
                  <Text style={{marginTop: 5}}>Snapchat</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('pressed')}
                    style={{
                      elevation: 10,
                      backgroundColor: '#1E2732',
                      borderRadius: 48,
                      width: 48,
                      height: 48,
                    }}>
                    <Image
                      source={{
                        uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/facebook.png',
                      }}
                      style={{...StyleSheet.absoluteFill, borderRadius: 48}}
                    />
                  </TouchableOpacity>
                  <Text>Sms</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            top: this.state.track_infos.top,
            left: this.state.track_infos.left,
            right: this.state.track_infos.right,
            bottom: this.state.track_infos.bottom,
            height: this.state.track_infos.height,
            backgroundColor: '#B00D72',
            paddingTop: 0,
            flex: 1,
            borderRadius: 10,
            elevation: 10,
            shadowColor: '#000000',
          }}>
          <LinearGradient
            colors={['#7856FF', '#1E2732']}
            style={{paddingTop: StatusBar.currentHeight, flex: 1}}>
            <View>
              <View
                style={{
                  width: Dimensions.get('screen').width,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  paddingHorizontal: 30,
                }}>
                <TouchableOpacity onPress={() => this._deploy_track_infos()}>
                  <Icon name={'x'} size={24} color={'white'} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  zIndex: 10,
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    onPress={() => this._shuffle()}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name="shuffle"
                      size={36}
                      style={{
                        color: this.state?.listening?.shuffle_state
                          ? 'green'
                          : 'white',
                        opacity: this.state?.listening.actions.disallows
                          .toggling_shuffle
                          ? 0.2
                          : 1,
                      }}
                    />
                    <Text style={{marginTop: 5}}>Lecture aléatoire</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this._repeat()}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name="repeat"
                      size={36}
                      style={{
                        color:
                          this.state?.listening?.repeat_state == 'context'
                            ? 'green'
                            : this.state?.listening?.repeat_state == 'track'
                            ? '#B00D70'
                            : 'white',
                        opacity:
                          this.state?.listening.actions.disallows
                            .toggling_repeat_track ||
                          this.state?.listening.actions.disallows
                            .toggling_repeat_context
                            ? 0.2
                            : 1,
                      }}
                    />
                    <Text style={{marginTop: 5}}>Répéter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this._deploy_track_infos();
                      setTimeout(() => {
                        this._deploy_waiting_list();
                      }, 500);
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name={'list'} size={36} color={'white'} />
                    <Text style={{marginTop: 5}}>File d'attente</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView
              scrollEnabled={true}
              style={{
                width: Dimensions.get('screen').width,
                paddingHorizontal: 10,
                flex: 1,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: Dimensions.get('screen').width,
                  marginTop: 25,
                  flex: 1,
                }}>
                <View
                  style={{
                    elevation: 10,
                    backgroundColor: '#1E2732',
                    borderRadius: 10,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      height: Dimensions.get('screen').width / 2,
                      width: Dimensions.get('screen').width / 2,
                      elevation: 10,
                    }}>
                    <Image
                      source={{
                        uri: this.state?.listening?.item?.album?.images[1]?.url,
                      }}
                      style={{
                        ...StyleSheet.absoluteFill,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: Dimensions.get('screen').width / 2,
                      backgroundColor: '#7856FF',
                      padding: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <Text style={{color: 'white'}}>Partager</Text>
                  </View>
                </View>
                <View style={{marginTop: 5, flex: 1}}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      marginTop: 5,
                      textAlign: 'center',
                    }}>
                    {this.state?.listening?.item?.name}
                  </Text>
                  <FlatList
                    data={this.state?.listening?.item?.artists}
                    horizontal={true}
                    style={{textAlign: 'center'}}
                    renderItem={({item, key}) => (
                      <Text
                        style={{
                          color: 'lightgrey',
                          marginTop: 5,
                          textAlign: 'center',
                        }}>
                        {item.name}
                      </Text>
                    )}
                    ItemSeparatorComponent={() => (
                      <Text style={{marginTop: 5}}>, </Text>
                    )}
                  />
                </View>
              </View>
              {/*<TouchableOpacity*/}
              {/*  onPress={() => this._like()}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon*/}
              {/*    name={'heart'}*/}
              {/*    size={24}*/}
              {/*    color={*/}
              {/*      this.state.listening?.item?.is_liked ? 'purple' : 'white'*/}
              {/*    }*/}
              {/*  />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Liker*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name={'home'} size={24} color={'white'} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Ajouter à une playlist*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name={'plus'} size={24} color={'white'} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Ajouter à la file d'attente*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name="disc" color={'white'} size={24} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Voir l'album*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name="user" color={'white'} size={24} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Voir l'artiste*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name="share" color={'white'} size={24} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Partager*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name="clock" solid={false} color={'white'} size={24} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Minuteur de veille*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name="mic" color={'white'} size={24} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Radio liée au titre*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name={'info'} size={24} color={'white'} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Afficher les crédits*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity*/}
              {/*  onPress={() => alert('test')}*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'flex-start',*/}
              {/*    flex: 1,*/}
              {/*  }}>*/}
              {/*  <Icon name={'alert-triangle'} size={24} color={'white'} />*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 16,*/}
              {/*      fontWeight: 'bold',*/}
              {/*      color: 'white',*/}
              {/*      marginVertical: 20,*/}
              {/*      marginLeft: 10,*/}
              {/*    }}>*/}
              {/*    Signaler un abus*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    ) : null;
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};
const mapDispatchToProps = {
  setListening,
  refreshListening,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAlt);
