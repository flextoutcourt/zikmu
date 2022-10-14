import React, {useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Value,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {clamp, onGestureEvent, timing, withSpring} from 'react-native-redash';
import Icon from 'react-native-vector-icons/Feather';
import {connect, useDispatch} from 'react-redux';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import SpotifyWebApi from 'spotify-web-api-node';
import {
  refreshListening,
  setListening,
} from '../../redux/features/listening/listeningSlice';

const spotifyApi = new SpotifyWebApi();

const {height} = Dimensions.get('window');
const TABBAR_HEIGHT = 50;
const MINIMIZED_PLAYER_HEIGHT = 65;
const SNAP_TOP = 0;
const SNAP_BOTTOM = height - TABBAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT;
const config = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};

const PlayerAlt = props => {
  const [listening, setListening] = useState(null);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState('string');
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);
  const [repeat, setRepeat] = useState('string');

  spotifyApi.setAccessToken(props.store.authentication.accessToken);

  useEffect(() => {
    let interval = setInterval(() => {
      _call_listening();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const _call_listening = () => {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      setListening(response?.body);
      setProgress(
        (response?.body?.progress_ms / response?.body?.item?.duration_ms) *
          (Dimensions.get('screen').width - 40),
      );
      _determine_like(
        response?.body?.item?.id ? response?.body?.item?.id : null,
      );
      _init(response?.body);
    });
  };

  const _determine_play_pause_icon = () => {
    return play ? 'pause' : 'play';
  };

  const _determine_play_pause = () => {
    listening?.is_playing ? _pause() : _play();
  };

  const _determine_like = (id = null) => {
    if (id !== null) {
      const request = spotifyApi.containsMySavedTracks([id]);
      return request.then(response => setLiked(response?.body[0]));
    }
  };

  const _init = listening => {
    setRepeat(listening?.repeat_state);
    setShuffle(listening?.shuffle_state ? true : false);
    setPlay(listening?.is_playing === false ? false : true);
  };

  /**
   * Enable the shuffling state
   * @private
   */
  const _shuffle = () => {
    fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
    setShuffle(!shuffle);
  };

  const _repeat = () => {
    fetch(`https://api.spotify.com/v1/me/player/repeat?state=${!repeat}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  };

  /**
   * Pause the player
   * @private
   */
  const _pause = () => {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
    setPlay(!play);
    _call_listening();
  };

  /**
   * Resume the player
   * @private
   */
  const _play = () => {
    fetch('https://api.spotify.com/v1/me/player/play', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
    _call_listening();
    setPlay(!play);
  };

  const _next = () => {
    fetch('https://api.spotify.com/v1/me/player/next', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    _call_listening();
  };

  const _prev = () => {
    fetch('https://api.spotify.com/v1/me/player/prev', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    _call_listening();
  };

  const Progress = () => {
    return (
      <View
        style={{
          width: Dimensions.get('screen').width - 40,
          height: 2,
          backgroundColor: 'lightgrey',
          position: 'absolute',
          left: 10,
          right: 10,
          bottom: 0,
          borderRadius: 10,
        }}>
        <View
          style={{
            width: Math.floor(progress ? progress : 1),
            height: 2,
            margin: 0,
            backgroundColor: 'white',
            borderRadius: 10,
          }}
        />
      </View>
    );
  };

  const PlayerContainer = ({children}) => {
    return (
      <View
        style={{
          width: Dimensions.get('screen').width - 20,
          height: 65,
          backgroundColor: 'grey',
          position: 'absolute',
          bottom: Dimensions.get('screen').height - 65,
          left: 10,
          right: 10,
          borderRadius: 10,
          overflow: 'hidden',
          opacity: 0,
        }}>
        {children}
      </View>
    );
  };

  const BigPlayer = () => {
    return (
      <>
        <View
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
            paddingTop: StatusBar.currentHeight * 2,
            backgroundColor: 'grey',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: Dimensions.get('screen').width - 40,
              marginBottom: StatusBar.currentHeight,
            }}>
            <Icon name={'chevron-down'} size={30} color={'white'} />
            <Text style={{color: 'white', fontSize: 20}}>
              {listening?.item?.album?.name}
            </Text>
            <Icon name={'more-vertical'} size={30} color={'white'} />
          </View>
          <View
            style={{
              width: Dimensions.get('screen').width - 20,
              height: Dimensions.get('screen').width - 20,
              backgroundColor: 'black',
              borderRadius: 10,
              marginBottom: StatusBar.currentHeight,
            }}>
            <Image
              source={{uri: listening?.item?.album?.images[0]?.url}}
              style={{
                width: Dimensions.get('screen').width - 20,
                height: Dimensions.get('screen').width - 20,
                resizeMode: 'cover',
                borderRadius: 10,
              }}
            />
          </View>
          <View
            style={{
              width: Dimensions.get('screen').width - 20,
              backgroundColor: 'red',
              marginBottom: StatusBar.currentHeight,
            }}>
            <Text style={{color: 'white', fontSize: 30}}>
              {listening?.item?.name}
            </Text>
            <Text>
              {listening?.item?.artists.map((artist, index) => {
                return (
                  <Text key={index} style={{color: 'white'}}>
                    {artist.name}
                    {index !== listening?.item?.artists.length - 1 ? ', ' : ''}
                  </Text>
                );
              })}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: Dimensions.get('screen').width / 1.2,
            }}>
            <TouchableOpacity onPress={() => _shuffle()}>
              <Icon
                name={'shuffle'}
                color={shuffle ? 'white' : 'darkgrey'}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => _prev()}>
              <Icon name={'skip-back'} color={'white'} size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => play ? _pause() : _play()}>
              <Icon name={play ? 'pause' : 'play'} color={'white'} size={50} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => _next()}>
              <Icon name={'skip-forward'} color={'white'} size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('repeat')}>
              <Icon name={'repeat'} color={'darkgrey'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const MiniPlayer = () => {
    return (
      <PlayerContainer>
        <AlbumContainer />
        <Progress />
      </PlayerContainer>
    );
  };

  const AlbumContainer = () => {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            height: 46,
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 43,
              width: 43,
              backgroundColor: 'blue',
              borderRadius: 10,
              marginLeft: 10,
            }}>
            <Image
              source={{uri: listening?.item?.album?.images[0]?.url}}
              style={[StyleSheet.absoluteFill, {borderRadius: 10}]}
            />
          </View>
          <View style={{overflow: 'hidden', justifyContent: 'center'}}>
            <View
              style={{
                marginLeft: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>{listening?.item?.name}</Text>
              <Text style={{color: 'white', marginHorizontal: 5}}>-</Text>
              <Text style={{color: 'white'}}>
                {listening?.item?.artists[0]?.name}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon name={'bluetooth'} color={'purple'} />
              <Text>{listening?.device?.name}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: 46,
            paddingRight: 5,
          }}>
          <TouchableOpacity onPress={() => alert('test')}>
            <Icon name={'speaker'} size={24} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => _next()}
            style={{marginHorizontal: 10}}>
            <Icon name={'heart'} size={24} color={liked ? 'purple' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _determine_play_pause()}>
            <Icon
              name={_determine_play_pause_icon()}
              size={24}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const translationY = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const offset = new Value(SNAP_BOTTOM);
  const goUp: Animated.Value<0 | 1> = new Value(0);
  const goDown: Animated.Value<0 | 1> = new Value(0);
  const gestureHandler = onGestureEvent({
    state,
    translationY,
    velocityY,
  });
  const translateY = withSpring({
    value: clamp(translationY, SNAP_TOP, SNAP_BOTTOM),
    velocity: velocityY,
    offset,
    state,
    snapPoints: [SNAP_TOP, SNAP_BOTTOM],
    config,
  });

  return (
    <>
      <BigPlayer onPress={() => goDown.setValue(1)} />
      <MiniPlayer />
    </>
  );
};

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
