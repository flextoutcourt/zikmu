import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {Icon} from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';

class Bigplayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listening: false,
      paroles: false,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this._get_listening().then(json => {
        this.setState({listening: json});
      });
    }, 1000);
  }

  _get_listening = () => {
    const promise = axios.get('https://api.spotify.com/v1/me/player', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
    });
    const response = promise.then(data => data.data);
    return response;
  };

  _pause = () => {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  };

  _play = () => {
    fetch('https://api.spotify.com/v1/me/player/play', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  };

  _next = () => {
    fetch('https://api.spotify.com/v1/me/player/next', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  };

  _prev = () => {
    if (this.state.listening?.progress_ms > 10000) {
      this._seek(0);
    } else {
      fetch('https://api.spotify.com/v1/me/player/previous', {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    }
  };

  _seek = position => {
    fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${Math.round(
        position * 1000,
      )}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      },
    ).catch(e => {
      console.log(e);
    });
  };

  _shuffle = () => {
    fetch(
      `https://api.spotify.com/v1/me/player/shuffle?state=${!this.state
        .listening?.shuffle_state}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      },
    );
  };

  _repeat = () => {
    let state;
    if (this.state.listening?.repeat_state == 'context') {
      state = 'track';
    } else if (this.state.listening?.repeat_state == 'track') {
      state = 'off';
    } else {
      state = 'context';
    }
    fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  };

  render() {
    return (
      <View style={{padding: 10}}>
        {/* <View style={{flex: 2.5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: StatusBar.currentHeight}}>
                        <TouchableOpacity onPress={() => true}>
                            <Icon name="arrow-left" size={24} color={"white"}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="ellipsis-v" size={24} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                    <Text numberOfLines={1} style={{fontSize: 24, textAlign: 'center', color: 'white', marginBottom: 20}}>{this.state.listening?.item?.album?.name}</Text>
                    <Image
                        source={{uri: this.state.listening?.item?.album?.images[0]?.url}}
                        style={{width: Dimensions.get('screen').width - 24, height: Dimensions.get('screen').width - 24, borderRadius: 10}}
                    />
                    <TouchableOpacity onPress={() => {}} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: "50%", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, borderWidth: 2, borderColor: 'white', borderStyle: 'solid', marginTop: 10}}>
                        <View style={{fontSize: 18, color: 'white', flexDirection: 'row'}}>
                            <Icon name='heart' size={24} color={"white"} />
                            <Text style={{paddingLeft: 10, fontSize: 16}}>Ajouter</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                    <View style={{flexDirection: 'row', marginTop: 15, width: '100%'}}>
                        <SeekBar trackLength={this.state.listening?.item?.duration_ms / 1000 ?? 0} currentPosition={this.state.listening?.progress_ms / 1000} onSeek={this._seek} />
                    </View>
                    <View>
                        <Text numberOfLines={1} style={{fontSize: 24, color: 'white', textAlign: 'center'}}>
                            {this.state.listening?.item?.name}
                        </Text>
                        <View style={{marginBottom: 10}}>
                            <FlatList
                                data={this.state.listening?.item?.artists}
                                scrollEnabled={true}
                                horizontal={true}
                                ItemSeparatorComponent={() => (
                                    <Text>, </Text>
                                )}
                                renderItem={({item, key}) => (
                                    <TouchableOpacity onPress={() => rootNavigation.navigate('Artist', {
                                        artist_id: item.id
                                    })}>
                                        <Text style={{color: 'white'}}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 10}}>
                        <TouchableOpacity onPress={() => {this._shuffle()}}>
                            <Icon name="random" size={24} style={{color: this.state.listening?.shuffle_state ? 'green' : 'white'}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._prev()}>
                            <Icon name="caret-left" size={48} style={{color: 'white'}}/>
                        </TouchableOpacity>
                        {
                            this.state.listening.is_playing
                            ?
                                <TouchableOpacity
                                onPress={() => {
                                        this._pause()
                                    }}
                                >
                                    <Icon name="pause" size={48} style={{marginLeft: 5, marginRight: 5, color: "white"}} />
                                </TouchableOpacity>
                            :
                                <TouchableOpacity
                                    onPress={() => {
                                        this._play()
                                    }}
                                >
                                    <Icon name="play" size={48} style={{marginLeft: 5, marginRight: 5, color: "white"}} />
                                </TouchableOpacity>

                        }
                        <TouchableOpacity onPress={() => this._next()}>
                            <Icon name="caret-right" size={48} style={{color: 'white'}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this._repeat()}}>
                            <Icon name="redo" size={24} style={{color: this.state.listening?.repeat_state == 'context' ? 'green' : this.state.listening?.repeat_state == 'track' ? 'purple' : 'white' }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 25, marginTop: 10}}>
                        <TouchableOpacity onPress={() => {}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{marginRight: 10}}>File d'attente</Text>
                            <Icon name="list" size={24} style={{color: 'white'}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{backgroundColor: 'blue', borderRadius: 10, marginBottom: 50, height: this.state.paroles ? null : 450, width: '100%', marginVertical: 25, elevation: 5, position: this.state.paroles ? 'absolute' : 'relative', top: this.state.paroles ? 5 : null, left: this.state.paroles ? 5 : null, right: this.state.paroles ? 5 : null, bottom: this.state.paroles ? 5 : null, overflow: 'hidden'}}>
                    <Lyrics track={this.state.listening?.item} style={{color: 'white'}} />
                </View> */}
        <View
          style={{
            height: Dimensions.get('screen').height,
            backgroundColor: 'blue',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(Bigplayer);
