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
import LinearGradient from 'react-native-linear-gradient';
import * as rootNavigation from '../../utils/RootNavigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Liked from '../Track/Liked';
import axios from 'axios';
import {connect} from 'react-redux';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';
import SeekBar from './Player/Seek';
import TrackItem from '../Track/TrackItem';
import AlbumItemWithOffset from '../Album/AlbumItemWithOffset';

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
		setInterval(() => {
			this._get_listening().then(json => {
				this.setState({listening: json})
			});
		}, 1000);
		// BackHandler.addEventListener('hardwareBackPress', () => {
		// 	this.handleBackButton();
		// })
	}

	componentWillUnmount() {
		// BackHandler.removeEventListener('hardwareBackPress', () => {
		// 	this.handleBackButton();
		// })
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
		if (this.state.listening?.progress_ms > 10000) {
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
		if (this.state.listening?.repeat_state == 'context') {
			state = 'track';
		} else if (this.state.listening?.repeat_state == 'track') {
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
            return 'mobile';
        } else if (device_type === 'Speaker') {
            return 'volume-up';
        } else if (device_type === 'Computer') {
            return 'laptop';
        } else {
            return 'mobile';
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
				toValue: Dimensions.get('screen').height * 0.20,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.waiting_list.height, {
				toValue: Dimensions.get('screen').height * 0.80,
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

	}
	_deploy_share_menu = () => {

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

	}
	_deploy_track_infos = () => {

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
				toValue: Dimensions.get('screen').height * 0.10,
				useNativeDriver: false,
			}).start();
			Animated.spring(this.state.track_infos.height, {
				toValue: Dimensions.get('screen').height * 0.90,
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
			this.state.listening
				?
				<BottomTabBarHeightContext.Consumer>
					{tabBarHeight => {
						return (

							<Animated.View style={{
								position: 'absolute',
								bottom: this.state.player.bottom,
								left: this.state.player.left,
								right: this.state.player.right,
								top: this.state.player.top,
								backgroundColor: '#2c3e50',
								borderRadius: 10,
								paddingTop: this.state.player.padding,
							}}>
								<LinearGradient colors={['#34495e', '#2c3e50']} style={{borderRadius: 10}}>
								<TouchableOpacity onPress={() => this.state.big ? null : this._deploy_big_player()} disabled={this.state.big}>
									<View style={{margin: 10}}>
										{
											this.state.big
												?
												<View style={{flex: 1, width: Dimensions.get('screen').width -20, minHeight: 50, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 10}}>
													<TouchableOpacity onPress={() => this._deploy_big_player()}>
														<FontAwesome name={"angle-down"} size={24} color={"white"}/>
													</TouchableOpacity>
													<TouchableOpacity onPress={() => this._deploy_track_infos()}>
														<FontAwesome name={"bars"} size={24} color={"white"}/>
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
														source={{uri: this.state.listening?.item?.album?.images[0]?.url}}
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
																{this.state.listening?.item?.name}
															</Text>
															{!this.state.big ? <FontAwesome name={"circle"} size={5}
															                                style={{marginHorizontal: 5}}/> : null}
															{
																this.state.big
																?
																	<FlatList
																		data={this.state.listening?.item?.artists}
																		horizontal={true}
																		contentContainerStyle={{maxWidth: '90%'}}
																		ItemSeparatorComponent={() => (
																			<FontAwesome name={"circle"} size={5}
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
																			artist_id: this.state.listening?.item?.artists[0].id
																		});
																		setTimeout(() => {
																			this.state.big ? this._deploy_big_player() : null
																		}, 500)
																	}
																	}>
																		<Text style={{
																			color: 'white',
																			fontSize: this.state.player.track_infos.fontSize - (this.state.big ? 4 : 0)
																		}} numberOfLines={1}>{this.state.listening?.item?.artists[0]?.name}</Text>
																	</TouchableOpacity>
															}

														</Animated.View>
														{this.state.big ?
															<View style={{flexDirection: 'row'}}>
																<Liked track={this.state?.listening?.item} iconSize={this.state.big ? 24 : 24}/>
																{
																	this.state.listening?.actions?.disallows?.toggling_repeat_context && this.state.listening?.actions?.disallows?.toggling_repeat_track && this.state.listening?.actions?.disallows?.toggling_shuffle
																	?
																		<TouchableOpacity onPress={() => alert('not liked')} style={{marginLeft: 10}}>
																			<FontAwesome name={'ban'} size={24} color={'white'}/>
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

																<FontAwesome
																	name={this._display_device_icon(this.state.listening?.device?.type)}
																	size={16}
																	style={{color: '#B00D70', fontWeight: 'bold'}}/>
																<Text style={{
																	marginLeft: 5,
																	color: "#B00D70",
																	fontWeight: 'bold'
																}}>{this.state.listening?.device?.name}</Text>
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
																trackLength={!isNaN(this.state.listening?.item?.duration_ms / 1000) ? this.state.listening?.item?.duration_ms / 1000 : 10}
																currentPosition={!isNaN(this.state.listening?.progress_ms / 1000) ? this.state.listening?.progress_ms / 1000 : 0}
																onSeek={this._seek}/>
														</View>
														<View style={{
															width: Dimensions.get('screen').width - 20,
															flexDirection: 'row',
															justifyContent: 'space-around',
															alignItems: 'center',
															flex: 1
														}}>
															<TouchableOpacity onPress={() => this._shuffle()} disabled={this.state.listening.actions.disallows.toggling_shuffle}>
																<Icon name="random" size={24}
																      style={{color: this.state.listening?.shuffle_state ? 'green' :'white', opacity: this.state.listening.actions.disallows.toggling_shuffle ? 0.2 : 1}}/>
															</TouchableOpacity>
															<TouchableOpacity onPress={() => this._prev()}>
																<Icon name="step-backward"
																      size={this.state.big ? 36 : 24} style={{
																	marginLeft: 10,
																	marginRight: 10,
																	color: 'white'
																}}/>
															</TouchableOpacity>
															{
																this.state.listening.is_playing
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
																<Icon name="step-forward"
																      size={this.state.big ? 36 : 24} style={{
																	marginLeft: 10,
																	marginRight: 10,
																	color: 'white'
																}}/>
															</TouchableOpacity>
															<TouchableOpacity onPress={() => this._repeat()} disabled={this.state.listening.actions.disallows.toggling_repeat_track || this.state.listening.actions.disallows.toggling_repeat_context}>
																<Icon name="redo" size={24}
																      style={{color: this.state.listening?.repeat_state == 'context' ? 'green' : this.state.listening?.repeat_state == 'track' ? '#B00D70' : 'white', opacity: this.state.listening.actions.disallows.toggling_repeat_track || this.state.listening.actions.disallows.toggling_repeat_context ? 0.2 : 1}}/>
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
																<FontAwesome
																	name={this._display_device_icon(this.state.listening?.device?.type)}
																	size={24} style={{
																	color: '#B00D70',
																	fontWeight: 'bold',
																	marginLeft: 15
																}}/>
																<Text style={{
																	marginLeft: 5,
																	color: "#B00D70",
																	fontWeight: 'bold'
																}}>{this.state.listening?.device?.name}</Text>
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
																	<Icon name="stream" size={24}
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
														<Icon name="bluetooth-b" size={this.state.big ? 48 : 24}
														      style={{marginLeft: 10, marginRight: 10}}/>
														<Liked track={this.state?.listening?.item}
														       iconSize={this.state.big ? 48 : 24}/>
														{
															this.state.listening.is_playing
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
															width: (this.state.listening?.progress_ms) / (this.state.listening?.item?.duration_ms) * 100 + "%",
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
								<Animated.View style={{position: 'absolute', top: this.state.device_menu.top, left: this.state.device_menu.left, right: this.state.device_menu.right, bottom: this.state.device_menu.bottom, height: this.state.device_menu.height, backgroundColor: '#2f3640', paddingTop: 10, flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
									<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 30}}>
										<TouchableOpacity onPress={() => this._deploy_devices_menu()}>
											<FontAwesome name={"close"} size={24} color={"white"}/>
										</TouchableOpacity>
									</View>
									<View style={{flex: 1, padding: 30}}>
										<View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
											<FontAwesome name={'music'} size={48} color={'purple'} />
											<View style={{marginLeft: 20}}>
												<Text style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>Écoute en cours sur :</Text>
												<Text style={{color: 'purple', fontSize: 18}}>{this.state.devices?.active?.name}</Text>
											</View>
										</View>
										<Text style={{fontSize: 16, color: 'white', marginVertical: 10}}>Séléctionnez un appareil</Text>
										<FlatList
											data={this.state.devices?.list}
											renderItem={({item, key}) => (
												<TouchableOpacity onPress={() => this._transfer_playback(item.id)} style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
													<FontAwesome name={this._display_device_icon(item.type)} size={48} color={'white'} />
													<Text style={{fontSize: 16, marginLeft: 25}}>{item.name}</Text>
												</TouchableOpacity>
											)}
										/>
									</View>
								</Animated.View>
								<Animated.View style={{position: 'absolute', top: this.state.waiting_list.top, left: this.state.waiting_list.left, right: this.state.waiting_list.right, bottom: this.state.waiting_list.bottom, height: this.state.waiting_list.height, backgroundColor: '#2f3640', paddingTop: 10, flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
									<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 30}}>
										<TouchableOpacity onPress={() => this._deploy_waiting_list()}>
											<FontAwesome name={"close"} size={24} color={"white"}/>
										</TouchableOpacity>
									</View>
									{
										this.state.waiting_list.big
										?
											<View style={{elevation: 10, shadowColor: '#000'}}>
												<Text style={{marginLeft: 10, fontSize: 16, color: 'white'}}>En cours de lecture :</Text>
												<TrackItem track={this.state.listening?.item} album={this.state.listening?.item?.album} />
												{this.state.listening?.context ? <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 16, color: 'white'}}>Prochains titres {this.state.context?.type == 'album' ? "de " + this.state.listening?.item?.album?.name : null} : </Text> : null}
											</View>
										:
											null
									}
									<ScrollView style={{height: Dimensions.get('screen').height * 2, elevation: -5}}>
										{
											this.state.waiting_list.big
											?
												<View style={{flex: 1}}>
													<View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
														{
															this.state.listening.context
																?
																<View>
																	<AlbumItemWithOffset context={this.state.listening?.context} listening={this.state.listening} />
																</View>
																:
																null
														}
													</View>
												</View>
											:
												null
										}
									</ScrollView>
								</Animated.View>
								<Animated.View style={{position: 'absolute', top: this.state.share_menu.top, left: this.state.share_menu.left, right: this.state.share_menu.right, bottom: this.state.share_menu.bottom, height: this.state.share_menu.height, backgroundColor: '#2f3640', flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
									<LinearGradient colors={['#8e44ad', '#2f3640']} style={{flex: 1, borderRadius: 10, paddingTop: StatusBar.currentHeight}}>
										<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 30}}>
											<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Partager</Text>
											<TouchableOpacity onPress={() => this._deploy_share_menu()}>
												<FontAwesome name={"close"} size={24} color={"white"}/>
											</TouchableOpacity>
										</View>
										<View style={{flex: 1, padding: 30}}>
											<View style={{flexDirection: 'row', justifyContent: 'center'}}>
												<View style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 10, marginVertical: 30}}>
													<View style={{height: Dimensions.get('screen').width / 2, width: Dimensions.get('screen').width / 2, elevation: 10}}>
														<View style={{flex: 1, backgroundColor: 'black', elevation: 10, borderRadius: 10}}>
															<Image source={{uri: this.state.listening?.item?.album?.images[1]?.url}} style={{...StyleSheet.absoluteFill, borderRadius: 10}}/>
														</View>
													</View>
													<View style={{width: Dimensions.get('screen').width / 2, backgroundColor: '#2f3640', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
														<Text style={{color: "white", fontSize: 14, textAlign: 'center'}}>{this.state.listening?.item?.name}</Text>
														<FlatList
															data={this.state.listening?.item?.artists}
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
														title: `${this.state.listening?.item?.name} - ${this.state.listening?.item?.artists[0]?.name}`,
														// message: `${this.state.listening?.item?.external_urls?.spotify}`,
														message: 'Zik_mu://track/'+this.state.listening?.item?.id,
														url: 'https://flexcorp-dev.fr'
													}, {
														dialogTitle: `${this.state.listening?.item?.name} - ${this.state.listening?.item?.artists[0]?.name}`
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
								<Animated.View style={{position: 'absolute', top: this.state.track_infos.top, left: this.state.track_infos.left, right: this.state.track_infos.right, bottom: this.state.track_infos.bottom, height: this.state.track_infos.height, backgroundColor: '#2f3640', paddingTop: 10, flex: 1, borderRadius: 10, elevation: 10, shadowColor: "#000000"}}>
									<View style={{width: Dimensions.get('screen').width, height: 50, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 30}}>
										<TouchableOpacity onPress={() => this._deploy_track_infos()}>
											<FontAwesome name={"close"} size={24} color={"white"}/>
										</TouchableOpacity>
									</View>
									<View style={{height: '100%', width: Dimensions.get('screen').width}}>
										<View style={{flex: 1}}>
											<View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 30, paddingVertical: 10, zIndex: 10, backgroundColor: '#2f3640'}}>
												<View style={{flex: 1, flexDirection: 'row', justifyContent: "space-around"}}>
													<TouchableOpacity onPress={() => alert('set_shuffle')} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
														<Icon name="random" size={36}
															  style={{color: this.state.listening?.shuffle_state ? 'green' :'white', opacity: this.state.listening.actions.disallows.toggling_shuffle ? 0.2 : 1}}/>
														<Text style={{marginTop: 5}}>Lecture aléatoire</Text>
													</TouchableOpacity>
													<TouchableOpacity onPress={() => alert('set_repeat')} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
														<Icon name="redo" size={36}
															  style={{color: this.state.listening?.repeat_state == 'context' ? 'green' : this.state.listening?.repeat_state == 'track' ? '#B00D70' : 'white', opacity: this.state.listening.actions.disallows.toggling_repeat_track || this.state.listening.actions.disallows.toggling_repeat_context ? 0.2 : 1}}/>
														<Text style={{marginTop: 5}}>Répéter</Text>
													</TouchableOpacity>
													<TouchableOpacity onPress={() => {
														this._deploy_track_infos();
														setTimeout(() => {
															this._deploy_waiting_list();
														}, 500);
													}} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
														<FontAwesome name={'bars'} size={36} color={'white'}/>
														<Text style={{marginTop: 5}}>File d'attente</Text>
													</TouchableOpacity>
												</View>
											</View>
											<ScrollView contentContainerStyle={{alignItems: 'flex-start', justifyContent: 'flex-start', width: Dimensions.get('screen').width}} style={{flex: 1}}>
												<View style={{alignItems: 'center', justifyContent: 'center', width: Dimensions.get('screen').width, marginTop: 25}}>
													<View style={{elevation: 10, backgroundColor: '#2f3640', borderRadius: 10}}>
														<View style={{height: Dimensions.get('screen').width / 2, width: Dimensions.get('screen').width / 2, elevation: 10}}>
															<Image source={{uri: this.state.listening?.item?.album?.images[1]?.url}} style={{...StyleSheet.absoluteFill, borderTopLeftRadius: 10, borderTopRightRadius: 10}}/>
														</View>
														<View style={{width: Dimensions.get('screen').width / 2, backgroundColor: 'red', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
															<Text>Partager</Text>
														</View>
													</View>
													<View style={{marginTop: 5}}>
														<Text style={{color: 'white', fontWeight: "bold", marginTop: 5}}>{this.state.listening?.item?.name}</Text>
														<Text style={{color: 'lightgrey', marginTop: 5}}>{this.state.listening?.item?.artists[0].name}</Text>
													</View>
												</View>
												<View style={{flex: 1, paddingHorizontal: 30}}>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
													<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
														<FontAwesome name={'home'} size={18} color={'white'} />
														<Text style={{fontSize: 13, fontWeight: 'bold', color: 'white', marginVertical: 10, marginLeft: 10}}>t</Text>
													</View>
												</View>
											</ScrollView>
										</View>
									</View>
								</Animated.View>
							</Animated.View>

						)
					}}

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
