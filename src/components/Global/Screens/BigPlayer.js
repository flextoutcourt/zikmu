import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import axios from 'axios';
import {Icon} from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import listeningHandler from '../../../utils/listeningHandler';
import Animated from 'react-native-reanimated';
import {SharedElement} from 'react-navigation-shared-element';

class Bigplayer extends React.PureComponent {
    constructor(props) {
        super(props);
        const album_id =
        this.state = {
            listening: false,
            is_playing: false,
        };
    }

    componentDidMount() {
        this._start_interval();
    }

    _start_interval = () => {
        this.interval = setInterval(() => {
            this._get_listening();
        }, 50000);
    };

    forceStateRefresh = async () => {
        const listeningObject = await listeningHandler.get_listening_state(this.props.store.authentication.accessToken);
        this.props.setListening({listening: listeningObject.data});
    };

    _clear_interval = () => {
        clearInterval(this.timer);
    };

    _create_interval = (initialPosition) => {
        this.setState({currentProgress: initialPosition});
        alert(initialPosition);
        this.timer = setInterval(() => {
            this.setState({currentProgress: this.props.store.listening.current_progress + 1000});
        }, 1000);
    };

    _get_listening = async () => {
        const listeningObject = await listeningHandler.get_listening_state(this.props.store.authentication.accessToken);
        if (this.props.store.listening.listening) {
            this.props.refreshListening({listening: listeningObject.data});
        } else {
            this.props.setListening({listening: listeningObject.data});
        }
    };

    _determine_play_pause = async () => {
        if (this.state.is_playing) {
            this._pause();
        } else {
            this._play();
        }
    }

    _pause = () => {
        fetch('https://api.spotify.com/v1/me/player/pause', {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        this.forceStateRefresh();
        this.setState({is_playing: false});
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
        this.forceStateRefresh();
        this.setState({is_playing: true});
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
        this.forceStateRefresh();
    };

    _prev = () => {
        if (this.props.store.listening.current_progress > 10000) {
            this._seek(0);
        } else {
            fetch('https://api.spotify.com/v1/me/player/previous', {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
        }
        this.forceStateRefresh();
    };

    _seek = (position) => {
        fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.round(position * 1000)}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        })
            .catch(e => {
                console.log(e);
            });
        this.forceStateRefresh();
    };

    _shuffle = () => {
        fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!this.props.store.listening.listening?.shuffle_state}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        this.forceStateRefresh();
    };

    _repeat = () => {
        let state;
        if (this.props.store.listening.listening?.repeat_state == 'context') {
            state = 'track';
        } else if (this.props.store.listening.listening?.repeat_state == 'track') {
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
        this.forceStateRefresh();
    };

    PlayPauseButton = () => (
        this.state.is_playing ?
            <TouchableOpacity onPress={() => this._determine_play_pause()}>
                <Icon name={'pause'} color={'white'} size={24} style={styles.player.controls.icons.right} />
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => this._determine_play_pause()}>
                <Icon name={'play'} color={'white'} size={24} style={styles.player.controls.icons.right} />
            </TouchableOpacity>
    );

    render(){
        return(
            <View style={{flex: 1}}>
                <SharedElement id={this.props.store.listening?.listening?.item?.album?.id}>
                    <Animated.Image
                        source={{uri: this.props.store?.listening?.listening?.item?.album?.images?.[0]?.url}}
                        style={styles.player.album.image}
                    />
                </SharedElement>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    player: {
        container: {
            position: 'absolute',
            bottom: 50,
            left: 5,
            right: 5,
            height: 50,
            backgroundColor: '#6C4DE6',
            padding: 4,
            borderRadius: 10,
            flexDirection: 'row',
        },
        album: {
            container: {
                flex: 2,
                flexDirection: 'row',
                alignItems: 'center',
            },
            image: {
                height: 42,
                width: 42,
                borderRadius: 10,
                marginRight: 5,
            },
            infos: {
                name: {
                    color: 'white',
                },
                artist: {
                    color: '#BDBDBD',
                },
            },
        },
        controls: {
            container: {
                flex: 1,
                flexDirection: 'row',
                backgroundColor: '#6C4DE6',
                height: 42,
                alignItems: 'center',
                justifyContent: 'flex-end'
            },
            icons: {
                right: {
                    height: 24,
                    width: 24,
                    marginRight: 5,
                },
                center: {
                    height: 24,
                    width: 24,
                    marginHorizontal: 10,
                },
                left: {
                    height: 24,
                    width: 24,
                },
            },
        },
        timebar: {
            container: {
                flexDirection: 'row',
                marginTop: 5,
                position: 'absolute',
                bottom: 0,
                left: 10,
                right: 10,
            },
            outer:{
                height: 2,
                backgroundColor: 'grey',
                flex: 1,
                alignSelf: 'center',
                borderRadius: 5,
            },
            inner: {
                height: 2,
                backgroundColor: 'white',
                borderRadius: 5,
            }
        }
    },
});

const mapStateToProps = store => {
    return {
        store: store,
    };
};

export default connect(mapStateToProps)(Bigplayer);
