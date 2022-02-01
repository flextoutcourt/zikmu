import React from 'react';
import {
	Animated,
	Dimensions,
	Image,
	Platform,
	StatusBar,
	Text,
	TouchableHighlight,
	TouchableOpacity, UIManager,
	View,
} from 'react-native';
import * as rootNavigation from '../../utils/RootNavigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Liked from '../Track/Liked';
import axios from 'axios';
import {connect} from 'react-redux';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

class PlayerAlt extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			listening: null,
			paroles: false,
			big: false,
			player: {
				bottom: new Animated.Value(52),
				left: new Animated.Value(3),
				right: new Animated.Value(3),
				top: new Animated.Value(Dimensions.get('screen').height - 112),
				padding: new Animated.Value(0),
				track_image: {
					height: new Animated.Value(40),
					width: new Animated.Value(40),
					flex: new Animated.Value(1),
				},
				track_controls: {
					display: 'flex'
				},
				track_infos: {
					flexDirection: 'row',
					flexType: 'flex-start',
					fontSize: 14
				}
			}
		}
		if (Platform.OS === 'android') {
			if (UIManager.setLayoutAnimationEnabledExperimental) {
				UIManager.setLayoutAnimationEnabledExperimental(true);
			}
		}
	}

	_deploy_big_player = () => {
		if(this.state.big){
			Animated.spring(this.state.player.bottom, {
				toValue: 52,
				useNativeDriver: false,
				overshootClamping: true
			}).start()
			Animated.spring(this.state.player.top, {
				toValue: Dimensions.get('screen').height - 112,
				useNativeDriver: false,
				overshootClamping: true
			}).start();
			Animated.spring(this.state.player.left, {
				toValue: 3,
				useNativeDriver: false,
				overshootClamping: true
			}).start();
			Animated.spring(this.state.player.right, {
				toValue: 3,
				useNativeDriver: false,
				overshootClamping: true
			}).start();
			Animated.spring(this.state.player.padding, {
				toValue: 0,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			Animated.spring(this.state.player.track_image.height, {
				toValue: 40,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			Animated.spring(this.state.player.track_image.width, {
				toValue: 40,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			Animated.spring(this.state.player.track_image.flex, {
				toValue: 1,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			this.setState((prevState) => ({
				player: {
					...prevState.player,
					track_controls: {
						display: 'flex'
					},
					track_infos: {
						flexDirection: 'row',
						flexType: 'flex-start',
						fontSize: 14
					}
				},
			}))

		}else{
			Animated.spring(this.state.player.bottom, {
				toValue: 0,
				useNativeDriver: false,
				overshootClamping: true
			}).start();
			Animated.spring(this.state.player.top, {
				toValue: 0,
				useNativeDriver: false,
				overshootClamping: true
			}).start();
			Animated.spring(this.state.player.left, {
				toValue: 0,
				useNativeDriver: false,
				overshootClamping: true
			}).start();
			Animated.spring(this.state.player.right, {
				toValue: 0,
				useNativeDriver: false,
				overshootClamping: true
			}).start();
			Animated.spring(this.state.player.padding, {
				toValue: StatusBar.currentHeight,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			Animated.spring(this.state.player.track_image.height, {
				toValue: Dimensions.get('screen').width - 20,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			Animated.spring(this.state.player.track_image.width, {
				toValue: Dimensions.get('screen').width - 20,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			Animated.spring(this.state.player.track_image.flex, {
				toValue: 1,
				useNativeDriver: false,
				overshootClamping: false
			}).start();
			this.setState((prevState) => ({
				player: {
					...prevState.player,
					track_controls: {
						display: 'none'
					},
					track_infos: {
						flexDirection: 'row',
						flexType: 'center',
						fontSize: 25
					}
				},
			}))
		}
		this.setState({
			big: !this.state.big
		})
	}

	componentDidMount(){
		setInterval(() => {
			this._get_listening().then(json => {
				this.setState({listening: json})
			});
		}, 1000);
	}



	_get_listening = () => {
		const promise = axios.get('https://api.spotify.com/v1/me/player', {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
		});
		return promise.then(data => data.data);
	}

	_pause = () => {
		fetch("https://api.spotify.com/v1/me/player/pause", {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
			method: "PUT"
		})
	}

	_play = () => {
		fetch("https://api.spotify.com/v1/me/player/play", {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
			method: "PUT"
		})
	}

	_next = () => {
		fetch('https://api.spotify.com/v1/me/player/next', {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
			method: 'POST'
		});
	}

	_prev = () => {
		if(this.state.listening?.progress_ms > 10000){
			this._seek(0);
		}else{
			fetch('https://api.spotify.com/v1/me/player/previous', {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + this.props.store.authentication.accessToken,
					"Content-Type": "application/json"
				},
				method: 'POST'
			})
		}
	}

	_seek = (position) => {
		fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.round(position * 1000)}`, {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
			method: "PUT"
		})
			.catch(e => {
				console.log(e);
			})
	}

	_shuffle = () => {
		fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!this.state.listening?.shuffle_state}`, {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
			method: 'PUT'
		})
	}

	_repeat = () => {
		let state;
		if(this.state.listening?.repeat_state == 'context'){
			state = 'track';
		}else if(this.state.listening?.repeat_state == 'track'){
			state = 'off';
		}else{
			state = 'context';
		}
		fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
			method: 'PUT'
		})
	}

	_display_device_icon = (device_type) => {
		switch (device_type) {
			case "Smartphone":
				return 'mobile';
				break;
			case "speaker":
				return 'volume-up';
				break;
			case "computer":
				return 'desktop';
				break;
			default:
				return 'mobile';
				break;
		}
	}

	render(){
		return(
			this.state.listening
			?
			<BottomTabBarHeightContext.Consumer>
				{tabBarHeight => {
					return(

					<Animated.View style={{
						position: 'absolute',
						bottom: this.state.player.bottom,
						left: this.state.player.left,
						right: this.state.player.right,
						top: this.state.player.top,
						backgroundColor: 'red',
						borderRadius: 10,
						paddingTop: this.state.player.padding,
					}}>
						<TouchableOpacity onPress={() => this._deploy_big_player()}>
							<View style={{margin: 10}}>
								<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
									<Animated.View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 3, flexWrap: 'wrap'}}>
										<Animated.Image source={{uri: this.state.listening?.item?.album?.images[0]?.url}} style={{minWidth: this.state.player.track_image.width ?? 40, minHeight: this.state.player.track_image.height ?? 40, maxWidth: this.state.player.track_image.width, maxHeight: this.state.player.track_image.height, margin: "auto", borderRadius: 10, flex: this.state.player.track_image.flex}} />
										<Animated.View style={{flex: 6, minWidth: this.state.big ? Dimensions.get('screen').width - 20 : 'auto', maxWidth: this.state.big ? Dimensions.get('screen').width - 20 : 'auto'}}>
											<Animated.View style={{marginLeft: 5, flexDirection: 'row', alignItems: 'center', justifyContent: this.state.player.track_infos.flexType, fontSize: this.state.player.track_infos.fontSize}}>
												<Text style={{color: 'white', fontSize: this.state.player.track_infos.fontSize}} numberOfLines={1}>{this.state.listening?.item?.name}</Text>
												<FontAwesome name={"circle"} size={5} style={{marginHorizontal: 5}} />
												<TouchableOpacity onPress={() => rootNavigation.navigate('Artist', {
													artist_id: this.state.listening?.item?.artists[0].id
												})}>
													<Text style={{color: 'white', fontSize: this.state.player.track_infos.fontSize}}>{this.state.listening?.item?.artists[0]?.name}</Text>
												</TouchableOpacity>
											</Animated.View>
											<View style={{marginLeft: 5, flexDirection: 'row', marginTop: 2, alignItems: 'center'}}>
												<FontAwesome name={this._display_device_icon(this.state.listening?.device?.type)} size={16} style={{color: '#B00D70', fontWeight: 'bold'}} />
												<Text style={{marginLeft: 5, color: "#B00D70", fontWeight: 'bold'}}>{this.state.listening?.device?.name}</Text>
											</View>
										</Animated.View>
									</Animated.View>
									<Animated.View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', zIndex: 99, display: this.state.player.track_controls?.display}}>
										<Icon name="bluetooth" size={24} style={{marginLeft: 10, marginRight: 10}} />
										<Liked track={this.state?.listening?.item} iconSize={24} />
										{
											this.state.listening.is_playing
												?
												<TouchableHighlight
													onPress={() => {
														this._pause()
													}}
												>
													<Icon name="pause" size={24} style={{marginLeft: 10, marginRight: 0, color: 'white'}} />
												</TouchableHighlight>
												:
												<TouchableHighlight
													onPress={() => {
														this._play()
													}}
												>
													<Icon name="play" size={24} style={{marginLeft: 10, marginRight: 0, color: 'white'}} />
												</TouchableHighlight>

										}
									</Animated.View>
								</View>
								<View style={{flexDirection: 'row', marginTop: 5, width: '100%', position: 'absolute', bottom: -10, left: 0, right: 0}}>
									<View style={{height: 2, backgroundColor: 'grey', flex: 1, alignSelf: 'center', borderRadius: 5}}>
										<View style={{height: 2, backgroundColor: 'white', width: (this.state.listening?.progress_ms) / (this.state.listening?.item?.duration_ms) * 100 + "%", borderRadius: 5}}/>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					</Animated.View>

				)}}

			</BottomTabBarHeightContext.Consumer>

			:
				null
		)
	}

}

const mapStateToProps = store => {
	return {
		store: store
	}
}

export default connect(mapStateToProps)(PlayerAlt)
