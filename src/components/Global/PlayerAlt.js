import React from 'react';
import {
	Animated,
	Dimensions,
	FlatList,
	Platform,
	StatusBar,
	Text,
	TouchableOpacity,
	UIManager,
	StyleSheet,
	View,
	BackHandler, ScrollView, Image, Share,
} from 'react-native';

import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import * as rootNavigation from '../../utils/RootNavigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Feather';
import Liked from '../Track/Liked';
import axios from 'axios';
import {connect} from 'react-redux';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';
import SeekBar from './Player/Seek';
import TrackItem from '../Track/TrackItem';
import AlbumItemWithOffset from '../Album/AlbumItemWithOffset';
import listeningHandler from '../../utils/listeningHandler';
import {
	setAccessToken,
	setLoadingFalse,
	setLoadingTrue,
	setRefreshToken,
} from '../../redux/features/authentication/authenticationSlice';
import {getListening} from '../../redux/features/listening/listeningSlice';

class PlayerAlt extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			listening: null,
			devices: null,
			paroles: false,
			big: false,
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

	handleBackButton = () => {
		if(this.state.big){
			this._deploy_big_player();
			return false;
		}
		return false;
	}

	_deploy_big_player = () => {
		if (this.state.big) {
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

		} else {
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
						flexType: 'flex-start',
						fontSize: 25
					}
				},
			}))
		}
		this.setState({
			big: !this.state.big
		})
	}

	componentDidMount() {
		this._start_interval();
	}

	_start_interval = () => {
		// this.interval = setInterval(() => {
			this._get_listening();
		// }, 2000)
	}

	_stop_auto_refresh = () => {
		// clearInterval(this.interval);
	}

	_get_listening = async () => {
		const listeningObject = await listeningHandler.get_listening_state(this.props.store.authentication.accessToken);
		this.props.getListening({listening: listeningObject.data})
		// this.setState({listening: this.props.store.listening.listening});
		// this.setState({listening: this.props.store.listening.listening});
		// const promise = axios.get('https://api.spotify.com/v1/me/player', {
		// 	headers: {
		// 		Accept: "application/json",
		// 		Authorization: "Bearer " + this.props.store.authentication.accessToken,
		// 		"Content-Type": "application/json"
		// 	},
		// });
		// return promise.then(data => data.data);
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
		if (this.props.store.listening.listening?.progress_ms > 10000) {
			this._seek(0);
		} else {
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
		fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!this.props.store.listening.listening?.shuffle_state}`, {
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
		if (this.props.store.listening.listening?.repeat_state == 'context') {
			state = 'track';
		} else if (this.props.store.listening.listening?.repeat_state == 'track') {
			state = 'off';
		} else {
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
    }

	_deploy_devices_menu = () => {

		if(this.state.device_menu.big){
			Animated.spring(this.state.device_menu.top, {
				toValue: Dimensions.get('screen').height,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.device_menu.height, {
				toValue: 0,
				useNativeDriver: false,
			}).start();
		}else{
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
		this.setState((prevState) => ({
			...prevState,
			device_menu: {
				...prevState.device_menu,
				big: !this.state.device_menu.big,
			}
		}))

	}

	_deploy_waiting_list = () => {
		this._stop_auto_refresh();
		if(this.state.waiting_list.big){
			Animated.spring(this.state.waiting_list.top, {
				toValue: Dimensions.get('screen').height,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.waiting_list.height, {
				toValue: 0,
				useNativeDriver: false,
			}).start();
		}else{
			Animated.spring(this.state.waiting_list.top, {
				toValue: Dimensions.get('screen').height * 0,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.waiting_list.height, {
				toValue: Dimensions.get('screen').height * 1,
				useNativeDriver: false,
			}).start();
		}

		this.setState((prevState) => ({
			...prevState,
			waiting_list: {
				...prevState.waiting_list,
				big: !this.state.waiting_list.big,
			}
		}))
		this._start_interval();

	}

	_deploy_share_menu = () => {
		this._stop_auto_refresh();
		if(this.state.share_menu.big){
			Animated.spring(this.state.share_menu.top, {
				toValue: Dimensions.get('screen').height,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.share_menu.height, {
				toValue: 0,
				useNativeDriver: false,
			}).start();
		}else{
			Animated.spring(this.state.share_menu.top, {
				toValue: Dimensions.get('screen').height * 0,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.share_menu.height, {
				toValue: Dimensions.get('screen').height * 1,
				useNativeDriver: false,
			}).start();
		}
		this.setState((prevState) => ({
			...prevState,
			share_menu: {
				...prevState.share_menu,
				big: !this.state.share_menu.big,
			}
		}))
		this._start_interval();

	}

	_deploy_track_infos = () => {
		this._stop_auto_refresh();
		if(this.state.track_infos.big){
			Animated.spring(this.state.track_infos.top, {
				toValue: Dimensions.get('screen').height,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.track_infos.height, {
				toValue: 0,
				useNativeDriver: false,
			}).start();
		}else{
			Animated.spring(this.state.track_infos.top, {
				toValue: Dimensions.get('screen').height * 0,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.track_infos.height, {
				toValue: Dimensions.get('screen').height * 1,
				useNativeDriver: false,
			}).start();
		}
		this.setState((prevState) => ({
			...prevState,
			track_infos: {
				...prevState.track_infos,
				big: !this.state.track_infos.big,
			}
		}))
		this._start_interval();
	}

	_get_available_devices = () => {
		axios.get('https://api.spotify.com/v1/me/player/devices', {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
		})
			.then(data => data.data)
			.then(response => {
				let devices = this._check_current_device(response.devices);
				this.setState((prevState) => ({
					...prevState,
					devices: devices
				}));
			});
	}

	_check_current_device = (devices) => {
		let to_return = {
			active: {},
			list: []
		};
		devices.map((item) => {
			if(item.is_active){
				to_return.active = item;
			}else{
				to_return.list.push(item);
			}
		})
		return to_return;
	}

	_transfer_playback = async (device_id) => {
		let body = {
			'devices_ids': [
				device_id
			]
		}
		await fetch(`https://api.spotify.com/v1/me/player`, {
			body: JSON.stringify(body),
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			},
			method: 'PUT'
		})
		.finally(() => {
			this._get_available_devices();
		})
	}

	single_share = async (customOptions) => {
		try{
			await Share.shareSingle(customOptions);
		} catch(err){
			console.log(err)
		}
	}

	render() {
		return (
			this.props.store.listening.listening
				?
					<Animated.View style={{
						position: 'absolute',
						bottom: this.state.player.bottom,
						left: this.state.player.left,
						right: this.state.player.right,
						top: this.state.player.top,
						backgroundColor: '#B00D72',
						borderRadius: 10,
						paddingTop: this.state.player.padding,
					}}>
						<LinearGradient colors={['#B00D72', '#5523BF']} style={{borderRadius: 10}}>
						<TouchableOpacity onPress={() => this.state.big ? null : this._deploy_big_player()} disabled={this.state.big}>
							<View style={{margin: 10}}>
								{
									this.state.big
										?
										<View style={{flex: 1, width: Dimensions.get('screen').width -20, minHeight: 50, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 10}}>
											<TouchableOpacity onPress={() => this._deploy_big_player()}>
												<Icon name={"chevron-down"} size={24} color={"white"}/>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this._deploy_track_infos()}>
												<Icon name={"menu"} size={24} color={"white"}/>
											</TouchableOpacity>
										</View>
										:
										null
								}
								<View style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'flex-start',
									flexWrap: this.state.big ? 'wrap' : 'nowrap'
								}}>
									<Animated.View style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'flex-start',
										flex: 1,
										flexWrap: this.state.big ? 'wrap' : 'nowrap',
										elevation: 10,
									}}>
										<Animated.View style={{
											width: this.state.player.track_image.width ?? 40,
											height: this.state.player.track_image.height ?? 40,
											shadowOffset: { width: 10, height: 10},
											shadowColor: '#000',
											shadowOpacity: 1,
											elevation: 10,
											borderRadius: 10,
											overflow: 'visible'
										}}>
											<Animated.Image
												source={{uri: this.props.store.listening.listening?.item?.album?.images[0]?.url}}
												style={{
													minWidth: this.state.player.track_image.width ?? 40,
													minHeight: this.state.player.track_image.height ?? 40,
													maxWidth: this.state.player.track_image.width,
													maxHeight: this.state.player.track_image.height,
													margin: "auto",
													borderRadius: 10,
													flex: this.state.player.track_image.flex,
												}}/>
										</Animated.View>
										<Animated.View style={{
											flex: 6,
											minWidth: this.state.big ? Dimensions.get('screen').width - 20 : 'auto',
											maxWidth: this.state.big ? Dimensions.get('screen').width - 20 : 'auto',
											marginTop: this.state.big ? 25 : 0,
											minHeight: this.state.big ? Dimensions.get('screen').height - 20 : 40,
											maxHeight: this.state.big ? Dimensions.get('screen').height - 20 : 40
										}}>
											<Animated.View style={{
												marginLeft: 5,
												flexDirection: this.state.big ? 'row' : 'row',
												alignItems: 'center',
												justifyContent: this.state.big ? 'space-between' : 'flex-start',
												fontSize: this.state.player.track_infos.fontSize
											}}>
												<Animated.View style={{
													flexDirection: this.state.big ? 'column' : 'row',
													alignItems: this.state.big ? 'flex-start' : 'center',
													justifyContent: 'flex-start',
													flex: 1,
													maxWidth: this.state.big ? '100%' : '90%'
												}}>
													<Text style={{
														color: 'white',
														fontSize: this.state.player.track_infos.fontSize,
														maxWidth: this.state.big ? '90%' : '100%'
													}}
														numberOfLines={1}>
														{this.props.store.listening.listening?.item?.name}
													</Text>
													{!this.state.big ? <Icon name={"circle"} size={5}
																					style={{marginHorizontal: 5}}/> : null}
													{
														this.state.big
														?
															<FlatList
																data={this.props.store.listening.listening?.item?.artists}
																horizontal={true}
																contentContainerStyle={{maxWidth: '90%'}}
																ItemSeparatorComponent={() => (
																	<Icon name={"circle"} size={5}
																				 style={{marginHorizontal: 5, alignSelf: 'center'}}/>
																)}
																renderItem={({item, key}) => (
																	<TouchableOpacity onPress={() => {
																		rootNavigation.push('Artist', {
																			artist_id: item.id
																		});
																		setTimeout(() => {
																			this.state.big ? this._deploy_big_player() : null
																		}, 500)
																	}
																	}>
																		<Text style={{
																				color: 'white',
																				fontSize: this.state.player.track_infos.fontSize - (this.state.big ? 4 : 0)
																			}}
																			numberOfLines={1}
																		>
																			{item.name}
																		</Text>
																	</TouchableOpacity>
																)}
															/>
														:
															<TouchableOpacity onPress={() => {
																rootNavigation.navigate('Artist', {
																	artist_id: this.props.store.listening.listening?.item?.artists[0].id
																});
																setTimeout(() => {
																	this.state.big ? this._deploy_big_player() : null
																}, 500)
															}
															}>
																<Text style={{
																	color: 'white',
																	fontSize: this.state.player.track_infos.fontSize - (this.state.big ? 4 : 0)
																}} numberOfLines={1}>{this.props.store.listening.listening?.item?.artists[0]?.name}</Text>
															</TouchableOpacity>
													}

												</Animated.View>
												{this.state.big ?
													<View style={{flexDirection: 'row'}}>
														<Liked track={this.state?.listening?.item} iconSize={this.state.big ? 24 : 24}/>
														{
															this.props.store.listening.listening?.actions?.disallows?.toggling_repeat_context && this.props.store.listening.listening?.actions?.disallows?.toggling_repeat_track && this.props.store.listening.listening?.actions?.disallows?.toggling_shuffle
															?
																<TouchableOpacity onPress={() => alert('not liked')} style={{marginLeft: 10}}>
																	<Icon name={'slash'} size={24} color={'white'}/>
																</TouchableOpacity>
															:
																null
														}
													</View> : null}
											</Animated.View>
											{
												!this.state.big
													?
													<View style={{
														marginLeft: 5,
														flexDirection: 'row',
														marginTop: 2,
														alignItems: 'center'
													}}>

														<Icon
															name={this._display_device_icon(this.props.store.listening.listening?.device?.type)}
															size={16}
															style={{color: 'white', fontWeight: 'bold'}}/>
														<Text style={{
															marginLeft: 5,
															color: "white",
															fontWeight: 'bold'
														}}>{this.props.store.listening.listening?.device?.name}</Text>
													</View>
													:
													null
											}
										</Animated.View>
									</Animated.View>
									{
										this.state.big
											?
											<View style={{
												flexDirection: 'column',
												alignItems: 'flex-end',
												justifyContent: 'flex-end',
												height: Dimensions.get('screen').height / 4
											}}>
												<View style={{
													flexDirection: 'row',
													marginTop: 5,
													width: Dimensions.get('screen').width - 20
												}}>
													<SeekBar
														trackLength={!isNaN(this.props.store.listening.listening?.item?.duration_ms / 1000) ? this.props.store.listening.listening?.item?.duration_ms / 1000 : 10}
														currentPosition={!isNaN(this.props.store.listening.listening?.progress_ms / 1000) ? this.props.store.listening.listening?.progress_ms / 1000 : 0}
														onSeek={this._seek}/>
												</View>
												<View style={{
													width: Dimensions.get('screen').width - 20,
													flexDirection: 'row',
													justifyContent: 'space-around',
													alignItems: 'center',
													flex: 1
												}}>
													<TouchableOpacity onPress={() => this._shuffle()} disabled={this.props.store.listening.listening.actions.disallows.toggling_shuffle}>
														<Icon name="shuffle" size={24}
															  style={{color: this.props.store.listening.listening?.shuffle_state ? 'green' :'white', opacity: this.props.store.listening.listening.actions.disallows.toggling_shuffle ? 0.2 : 1}}/>
													</TouchableOpacity>
													<TouchableOpacity onPress={() => this._prev()}>
														<Icon name="skip-back"
															  size={this.state.big ? 36 : 24} style={{
															marginLeft: 10,
															marginRight: 10,
															color: 'white'
														}}/>
													</TouchableOpacity>
													{
														this.props.store.listening.listening.is_playing
															?
															<TouchableOpacity
																onPress={() => {
																	this._pause()
																}}
															>
																<Icon name="pause"
																	  size={this.state.big ? 48 : 24} style={{
																	marginLeft: 10,
																	marginRight: 0,
																	color: 'white'
																}}/>
															</TouchableOpacity>
															:
															<TouchableOpacity
																onPress={() => {
																	this._play()
																}}
															>
																<Icon name="play"
																	  size={this.state.big ? 48 : 24} style={{
																	marginLeft: 10,
																	marginRight: 0,
																	color: 'white'
																}}/>
															</TouchableOpacity>
													}
													<TouchableOpacity onPress={() => this._next()}>
														<Icon name="skip-forward"
															  size={this.state.big ? 36 : 24} style={{
															marginLeft: 10,
															marginRight: 10,
															color: 'white'
														}}/>
													</TouchableOpacity>
													<TouchableOpacity onPress={() => this._repeat()} disabled={this.props.store.listening.listening.actions.disallows.toggling_repeat_track || this.props.store.listening.listening.actions.disallows.toggling_repeat_context}>
														<Icon name="repeat" size={24}
															  style={{color: this.props.store.listening.listening?.repeat_state == 'context' ? 'green' : this.props.store.listening.listening?.repeat_state == 'track' ? '#B00D70' : 'white', opacity: this.props.store.listening.listening.actions.disallows.toggling_repeat_track || this.props.store.listening.listening.actions.disallows.toggling_repeat_context ? 0.2 : 1}}/>
													</TouchableOpacity>
												</View>
												<View style={{
													width: Dimensions.get('screen').width - 20,
													flexDirection: 'row',
													justifyContent: 'space-around',
													alignItems: 'center'
												}}>
													<TouchableOpacity onPress={() => this._deploy_devices_menu()} style={{
														marginLeft: 5,
														flexDirection: 'row',
														marginTop: 2,
														alignItems: 'center',
														flex: 2
													}}>
														<Icon
															name={this._display_device_icon(this.props.store.listening.listening?.device?.type)}
															size={24} style={{
															color: 'white',
															fontWeight: 'bold',
															marginLeft: 15
														}}/>
														<Text style={{
															marginLeft: 5,
															color: "white",
															fontWeight: 'bold'
														}}>{this.props.store.listening.listening?.device?.name}</Text>
													</TouchableOpacity>
													<View style={{
														flex: 2,
														flexDirection: 'row',
														justifyContent: 'flex-end',
														alignItems: 'center',
														marginRight: 15
													}}>
														<TouchableOpacity
															onPress={() => this._deploy_share_menu()}>
															<Icon name="share" size={this.state.big ? 24 : 24}
																  style={{
																	  marginLeft: 20,
																	  marginRight: 20,
																	  color: 'white'
																  }}/>
														</TouchableOpacity>
														<TouchableOpacity
															onPress={() => this._deploy_waiting_list()}>
															<Icon name="list" size={24}
																  style={{color: 'white'}}/>
														</TouchableOpacity>
													</View>
												</View>
											</View>
											:
											<Animated.View style={{
												flex: 1,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: this.state.big ? 'space-between' : 'flex-end',
												minWidth: this.state.big ? Dimensions.get('screen').width - 20 : 'auto'
											}}>
												<Icon name="speaker" size={this.state.big ? 48 : 24}
													  style={{marginLeft: 10, marginRight: 10}}/>
												<Liked track={this.state?.listening?.item}
													   iconSize={this.state.big ? 48 : 24}/>
												{
													this.props.store.listening.listening.is_playing
														?
														<TouchableOpacity
															onPress={() => {
																this._pause()
															}}
														>
															<Icon name="pause" size={this.state.big ? 48 : 24}
																  style={{
																	  marginLeft: 10,
																	  marginRight: 0,
																	  color: 'white'
																  }}/>
														</TouchableOpacity>
														:
														<TouchableOpacity
															onPress={() => {
																this._play()
															}}
														>
															<Icon name="play" size={this.state.big ? 48 : 24}
																  style={{
																	  marginLeft: 10,
																	  marginRight: 0,
																	  color: 'white'
																  }}/>
														</TouchableOpacity>

												}
											</Animated.View>
									}

								</View>
								{
									!this.state.big
										?
										<View style={{
											flexDirection: 'row',
											marginTop: 5,
											width: '100%',
											position: 'absolute',
											bottom: -10,
											left: 0,
											right: 0
										}}>
											<View style={{
												height: 2,
												backgroundColor: 'grey',
												flex: 1,
												alignSelf: 'center',
												borderRadius: 5
											}}>
												<View style={{
													height: 2,
													backgroundColor: 'white',
													width: (this.props.store.listening.listening?.progress_ms) / (this.props.store.listening.listening?.item?.duration_ms) * 100 + "%",
													borderRadius: 5
												}}/>
											</View>
										</View>
										:
										null
								}
							</View>
						</TouchableOpacity>
						</LinearGradient>
						<Animated.View style={{position: 'absolute', top: this.state.device_menu.top, left: this.state.device_menu.left, right: this.state.device_menu.right, bottom: this.state.device_menu.bottom, height: this.state.device_menu.height, backgroundColor: '#8e44ad', paddingTop: 10, flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
							<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 30}}>
								<TouchableOpacity onPress={() => this._deploy_devices_menu()}>
									<Icon name={"x"} size={24} color={"white"}/>
								</TouchableOpacity>
							</View>
							<View style={{flex: 1, padding: 30}}>
								<View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
									<Icon name={'music'} size={48} color={'white'} />
									<View style={{marginLeft: 20}}>
										<Text style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>Écoute en cours sur :</Text>
										<Text style={{color: 'white', fontSize: 18}}>{this.state.devices?.active?.name}</Text>
									</View>
								</View>
								<Text style={{fontSize: 16, color: 'white', marginVertical: 10}}>Séléctionnez un appareil</Text>
								<FlatList
									data={this.state.devices?.list}
									renderItem={({item, key}) => (
										<TouchableOpacity onPress={() => this._transfer_playback(item.id)} style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
											<Icon name={this._display_device_icon(item.type)} size={48} color={'white'} />
											<Text style={{fontSize: 16, marginLeft: 25}}>{item.name}</Text>
										</TouchableOpacity>
									)}
								/>
							</View>
						</Animated.View>
						<Animated.View style={{position: 'absolute', top: this.state.waiting_list.top, left: this.state.waiting_list.left, right: this.state.waiting_list.right, bottom: this.state.waiting_list.bottom, height: this.state.waiting_list.height, backgroundColor: '#B00D72', paddingTop: 0, flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
							<LinearGradient colors={['#8e44ad', '#2f3640']} style={{paddingTop: StatusBar.currentHeight, flex: 1}} >
								<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 30}}>
									<TouchableOpacity onPress={() => this._deploy_waiting_list()}>
										<Icon name={"x"} size={24} color={"white"}/>
									</TouchableOpacity>
								</View>
								{
									this.state.waiting_list.big
									?
										<View style={{elevation: 10, shadowColor: '#000'}}>
											<Text style={{marginLeft: 10, fontSize: 16, color: 'white'}}>En cours de lecture :</Text>
											<TrackItem track={this.props.store.listening.listening?.item} album={this.props.store.listening.listening?.item?.album} />
											{this.props.store.listening.listening?.context ? <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 16, color: 'white'}}>Prochains titres {this.state.context?.type == 'album' ? "de " + this.props.store.listening.listening?.item?.album?.name : null} : </Text> : null}
										</View>
									:
										null
								}
								<View style={{elevation: 10}}>
									{
										this.state.waiting_list.big
										?
											<View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
												{
													this.props.store.listening.listening.context
														?
															<AlbumItemWithOffset context={this.props.store.listening.listening?.context} listening={this.props.store.listening.listening} />
														:
														null
												}
											</View>
										:
											null
									}
								</View>
							</LinearGradient>
						</Animated.View>
						<Animated.View style={{position: 'absolute', top: this.state.share_menu.top, left: this.state.share_menu.left, right: this.state.share_menu.right, bottom: this.state.share_menu.bottom, height: this.state.share_menu.height, backgroundColor: '#B00D72', flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
							<LinearGradient colors={['#8e44ad', '#2f3640']} style={{flex: 1, borderRadius: 10, paddingTop: StatusBar.currentHeight}}>
								<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 30}}>
									<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Partager</Text>
									<TouchableOpacity onPress={() => this._deploy_share_menu()}>
										<Icon name={"x"} size={24} color={"white"}/>
									</TouchableOpacity>
								</View>
								<View style={{flex: 1, padding: 30}}>
									<View style={{flexDirection: 'row', justifyContent: 'center'}}>
										<View style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 10, marginVertical: 30}}>
											<View style={{height: Dimensions.get('screen').width / 2, width: Dimensions.get('screen').width / 2, elevation: 10}}>
												<View style={{flex: 1, backgroundColor: 'black', elevation: 10, borderRadius: 10}}>
													<Image source={{uri: this.props.store.listening.listening?.item?.album?.images[1]?.url}} style={{...StyleSheet.absoluteFill, borderRadius: 10}}/>
												</View>
											</View>
											<View style={{width: Dimensions.get('screen').width / 2, backgroundColor: '#2f3640', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
												<Text style={{color: "white", fontSize: 14, textAlign: 'center'}}>{this.props.store.listening.listening?.item?.name}</Text>
												<FlatList
													data={this.props.store.listening.listening?.item?.artists}
													renderItem={({item, key}) => (
														<TouchableOpacity onPress={() => {
															rootNavigation.push('Artist', {
																artist_id: item.id
															});
															setTimeout(() => {
																this.state.big ? this._deploy_big_player() : null
																this.state.share_menu.big ? this._deploy_share_menu() : null
															}, 500)
														}}>
															<Text style={{marginTop: 2,fontSize: 12, textAlign: 'center'}}>{item.name}</Text>
														</TouchableOpacity>
													)}
													ItemSeparatorComponent={() => (
														<Text>, </Text>
													)}
													horizontal={true}
												/>
											</View>
										</View>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, flexWrap: 'wrap'}}>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => alert('pressed')} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/facebook.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48}} />
											</TouchableOpacity>
											<Text style={{marginTop: 5}}>Copier le lien</Text>
										</View>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => alert('pressed')} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/whatsapp.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48}} />
											</TouchableOpacity>
											<Text style={{marginTop: 5}}>Whatsapp</Text>
										</View>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => alert('pressed')} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/instagram.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48}} />
											</TouchableOpacity>
											<Text style={{marginTop: 5}}>Stories</Text>
										</View>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => alert('pressed')} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/messenger.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48}} />
											</TouchableOpacity>
											<Text style={{marginTop: 5}}>Messenger</Text>
										</View>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, flexWrap: 'wrap'}}>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => alert('pressed')} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48, borderColor: "#3B579D", borderWidth: 2}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/facebook.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48, borderWidth: 2, borderColor: '#2f3640'}} />
											</TouchableOpacity>
											<Text style={{marginTop: 5}}>Stories</Text>
										</View>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => Share.share({
												title: `${this.props.store.listening.listening?.item?.name} - ${this.props.store.listening.listening?.item?.artists[0]?.name}`,
												// message: `${this.props.store.listening.listening?.item?.external_urls?.spotify}`,
												message: 'Zik_mu://track/'+this.props.store.listening.listening?.item?.id,
												url: 'https://flexcorp-dev.fr'
											}, {
												dialogTitle: `${this.props.store.listening.listening?.item?.name} - ${this.props.store.listening.listening?.item?.artists[0]?.name}`
											})} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/twitter.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48}} />
											</TouchableOpacity>
											<Text style={{marginTop: 5}}>Twitter</Text>
										</View>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => alert('pressed')} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/snapchat.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48}} />
											</TouchableOpacity>
											<Text style={{marginTop: 5}}>Snapchat</Text>
										</View>
										<View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
											<TouchableOpacity onPress={() => alert('pressed')} style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 48, width: 48, height: 48}}>
												<Image source={{uri: 'http://zikmu.api.flexcorp-dev.fr/tmp/icons/facebook.png'}} style={{...StyleSheet.absoluteFill, borderRadius: 48}} />
											</TouchableOpacity>
											<Text>Sms</Text>
										</View>
									</View>
								</View>
							</LinearGradient>
						</Animated.View>
						<Animated.View style={{position: 'absolute', top: this.state.track_infos.top, left: this.state.track_infos.left, right: this.state.track_infos.right, bottom: this.state.track_infos.bottom, height: this.state.track_infos.height, backgroundColor: '#B00D72', paddingTop: 0, flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
							<LinearGradient colors={['#8e44ad', '#2f3640']} style={{paddingTop: StatusBar.currentHeight, flex: 1}} >
								<View>
									<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 30}}>
										<TouchableOpacity onPress={() => this._deploy_track_infos()}>
											<Icon name={"x"} size={24} color={"white"}/>
										</TouchableOpacity>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 30, paddingVertical: 10, zIndex: 10, backgroundColor: 'transparent'}}>
										<View style={{flex: 1, flexDirection: 'row', justifyContent: "space-around"}}>
											<TouchableOpacity onPress={() => this._shuffle()} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
												<Icon name="shuffle" size={36}
													  style={{color: this.props.store.listening.listening?.shuffle_state ? 'green' :'white', opacity: this.props.store.listening.listening.actions.disallows.toggling_shuffle ? 0.2 : 1}}/>
												<Text style={{marginTop: 5}}>Lecture aléatoire</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this._repeat()} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
												<Icon name="repeat" size={36}
													  style={{color: this.props.store.listening.listening?.repeat_state == 'context' ? 'green' : this.props.store.listening.listening?.repeat_state == 'track' ? '#B00D70' : 'white', opacity: this.props.store.listening.listening.actions.disallows.toggling_repeat_track || this.props.store.listening.listening.actions.disallows.toggling_repeat_context ? 0.2 : 1}}/>
												<Text style={{marginTop: 5}}>Répéter</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => {
												this._deploy_track_infos();
												setTimeout(() => {
													this._deploy_waiting_list();
												}, 500);
											}} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
												<Icon name={'list'} size={36} color={'white'}/>
												<Text style={{marginTop: 5}}>File d'attente</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<ScrollView scrollEnabled={true} style={{width: Dimensions.get('screen').width, paddingHorizontal: 10, flex: 1}}>
									<View style={{alignItems: 'center', justifyContent: 'center', width: Dimensions.get('screen').width, marginTop: 25, flex: 1}}>
										<View style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 10, flex: 1}}>
											<View style={{height: Dimensions.get('screen').width / 2, width: Dimensions.get('screen').width / 2, elevation: 10}}>
												<Image source={{uri: this.props.store.listening.listening?.item?.album?.images[1]?.url}} style={{...StyleSheet.absoluteFill, borderTopLeftRadius: 10, borderTopRightRadius: 10}}/>
											</View>
											<View style={{width: Dimensions.get('screen').width / 2, backgroundColor: 'red', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
												<Text>Partager</Text>
											</View>
										</View>
										<View style={{marginTop: 5, flex: 1}}>
											<Text style={{color: 'white', fontWeight: "bold", marginTop: 5, textAlign: 'center'}}>{this.props.store.listening.listening?.item?.name}</Text>
											<FlatList
												data={this.props.store.listening.listening?.item?.artists}
												horizontal={true}
												style={{textAlign: 'center'}}
												renderItem={({item, key}) => (
													<Text style={{color: 'lightgrey', marginTop: 5, textAlign: 'center'}}>{item.name}</Text>
												)}
												ItemSeparatorComponent={() => (<Text style={{marginTop: 5}}>, </Text>)}
											/>
										</View>
									</View>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name={'heart'} size={24} color={'white'} />
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Liker</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name={'slash'} size={24} color={'white'} />
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Masquer ce titre</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name={'home'} size={24} color={'white'} />
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Ajouter à une playlist</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name={'plus'} size={24} color={'white'} />
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Ajouter à la file d'attente</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name="disc" color={"white"} size={24}/>
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Voir l'album</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name="user" color={"white"} size={24}/>
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Voir l'artiste</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name="share" color={"white"} size={24}/>
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Partager</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name="clock" solid={false} color={"white"} size={24}/>
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Minuteur de veille</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name="mic" color={"white"} size={24}/>
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Radio liée au titre</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name={'info'} size={24} color={'white'} />
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Afficher les crédits</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => alert('test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
										<Icon name={'alert-triangle'} size={24} color={'white'} />
										<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 20, marginLeft: 10}}>Signaler un abus</Text>
									</TouchableOpacity>
								</ScrollView>
							</LinearGradient>
						</Animated.View>
					</Animated.View>
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
const mapDispatchToProps = {
	getListening,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAlt)
