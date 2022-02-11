import axios from 'axios';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import * as rootNavigation from './../../utils/RootNavigation';
import Lyrics from './Player/Lyrics';
import SeekBar from './Player/Seek';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Liked from '../Track/Liked';


class Player extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			listening: null,
			big: false,
			paroles: false
		}
	}

	componentDidMount() {
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
        if (device_type === 'Smartphone') {
            return 'mobile';
        } else if (device_type === 'speaker') {
            return 'volume-up';
        } else if (device_type === 'computer') {
            return 'desktop';
        } else {
            return 'mobile';
        }
    }

	render() {
		return (
			this.state.listening
				?
				<TouchableOpacity
					style={{
						position: 'absolute',
						bottom: this.state.big ? 0 : 60,
						top: this.state.big ? 0 : null,
						left: this.state.big ? 0 : 2,
						right: this.state.big ? 0 : 2,
						backgroundColor: this.state.big ? "#030303" : "#353b48",
						zIndex: 99,
						padding: 0,
						borderRadius: this.state.big ? 0 : 10
					}}
					onPress={() => {
						!this.state.big ? this.setState({big: true}) : null
					}}
					activeOpacity={this.state.big ? 1 : 0.2}
				>
					{
						this.state.big
							?
							<LinearGradient colors={['#B00D72', '#5523BF']}>
								<ScrollView style={{padding: 10}}>
									<View style={{flex: 2.5}}>
										<View style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
											marginBottom: 20,
											marginTop: StatusBar.currentHeight
										}}>
											<TouchableOpacity onPress={() => this.setState({big: false})}>
												<Icon name="arrow-left" size={24} color={"white"}/>
											</TouchableOpacity>
											<TouchableOpacity>
												<Icon name="ellipsis-v" size={24} color={"white"}/>
											</TouchableOpacity>
										</View>
										<Text numberOfLines={1} style={{
											fontSize: 24,
											textAlign: 'center',
											color: 'white',
											marginBottom: 20
										}}>{this.state.listening?.item?.album?.name}</Text>
										<Image
											source={{uri: this.state.listening?.item?.album?.images[0]?.url}}
											style={{
												width: Dimensions.get('screen').width - 24,
												height: Dimensions.get('screen').width - 24,
												borderRadius: 10
											}}
										/>
										<TouchableOpacity onPress={() => {
										}} style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
											alignSelf: 'center',
											width: "50%",
											paddingHorizontal: 20,
											paddingVertical: 10,
											borderRadius: 100,
											borderWidth: 2,
											borderColor: 'white',
											borderStyle: 'solid',
											marginTop: 10
										}}>
											<View style={{fontSize: 18, color: 'white', flexDirection: 'row'}}>
												<Icon name='heart' size={24} color={"white"}/>
												<Text style={{paddingLeft: 10, fontSize: 16}}>Ajouter</Text>
											</View>
										</TouchableOpacity>
									</View>
									<View style={{flex: 1, justifyContent: 'flex-start'}}>
										<View style={{flexDirection: 'row', marginTop: 15, width: '100%'}}>
											<SeekBar trackLength={this.state.listening?.item?.duration_ms / 1000 ?? 0}
											         currentPosition={this.state.listening?.progress_ms / 1000}
											         onSeek={this._seek}/>
										</View>
										<View>
											<Text numberOfLines={1}
											      style={{fontSize: 24, color: 'white', textAlign: 'center'}}>
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
														<TouchableOpacity onPress={() => {
															rootNavigation.navigate('Artist', {
																artist_id: item.id
															});
															this.setState({big: false})
														}}>
															<Text style={{color: 'white'}}>{item.name}</Text>
														</TouchableOpacity>
													)}
												/>
											</View>
										</View>
										<View style={{
											flexDirection: 'row',
											justifyContent: 'space-around',
											alignItems: 'center',
											marginHorizontal: 10
										}}>
											<TouchableOpacity onPress={() => {
												this._shuffle()
											}}>
												<Icon name="random" size={24}
												      style={{color: this.state.listening?.shuffle_state ? 'green' : 'white'}}/>
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
														<Icon name="pause" size={48}
														      style={{marginLeft: 5, marginRight: 5, color: "white"}}/>
													</TouchableOpacity>
													:
													<TouchableOpacity
														onPress={() => {
															this._play()
														}}
													>
														<Icon name="play" size={48}
														      style={{marginLeft: 5, marginRight: 5, color: "white"}}/>
													</TouchableOpacity>

											}
											<TouchableOpacity onPress={() => this._next()}>
												<Icon name="caret-right" size={48} style={{color: 'white'}}/>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => {
												this._repeat()
											}}>
												<Icon name="redo" size={24}
												      style={{color: this.state.listening?.repeat_state == 'context' ? 'green' : this.state.listening?.repeat_state == 'track' ? '#B00D70' : 'white'}}/>
											</TouchableOpacity>
										</View>
										<View style={{
											justifyContent: 'flex-end',
											alignItems: 'flex-end',
											marginRight: 25,
											marginTop: 10
										}}>
											<TouchableOpacity onPress={() => {
											}}>
												<View style={{
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'center'
												}}>
													<Text style={{marginRight: 10}}>File d'attente</Text>
													<Icon name="list" size={24} style={{color: 'white'}}/>
												</View>
											</TouchableOpacity>
										</View>
									</View>
									<View style={{
										backgroundColor: 'blue',
										borderRadius: 10,
										marginBottom: 50,
										height: this.state.paroles ? null : 450,
										width: '100%',
										marginVertical: 25,
										elevation: 5,
										position: this.state.paroles ? 'absolute' : 'relative',
										top: this.state.paroles ? 5 : null,
										left: this.state.paroles ? 5 : null,
										right: this.state.paroles ? 5 : null,
										bottom: this.state.paroles ? 5 : null,
										overflow: 'hidden'
									}}>
										<Lyrics track={this.state.listening?.item} style={{color: 'white'}}/>
									</View>
								</ScrollView>
							</LinearGradient>
							:
							<View style={{margin: 10}}>
								<View style={{flexDirection: 'row', alignItems: 'center'}}>
									<View style={{
										flexDirection: 'row',
										alignItems: 'center',
										flex: 3,
										overflow: 'hidden'
									}}>
										<Image source={{uri: this.state.listening?.item?.album?.images[0]?.url}}
										       style={{width: 50, height: 50, margin: "auto", borderRadius: 10}}/>
										<View>
											<View style={{marginLeft: 5, flexDirection: 'row'}}>
												<Text style={{color: 'white'}}
												      numberOfLines={1}>{this.state.listening?.item?.name}</Text>
												<Text> - </Text>
												<TouchableOpacity onPress={() => rootNavigation.navigate('Artist', {
													artist_id: this.state.listening?.item?.artists[0].id
												})}>
													<Text
														style={{color: 'white'}}>{this.state.listening?.item?.artists[0]?.name}</Text>
												</TouchableOpacity>
											</View>
											<View style={{
												marginLeft: 5,
												flexDirection: 'row',
												marginTop: 5,
												alignItems: 'center'
											}}>
												<FontAwesome
													name={this._display_device_icon(this.state.listening?.device?.type)}
													size={16} style={{color: '#B00D70', fontWeight: 'bold'}}/>
												<Text style={{
													marginLeft: 5,
													color: "#B00D70",
													fontWeight: 'bold'
												}}>{this.state.listening?.device?.name}</Text>
											</View>
										</View>
									</View>
									<View style={{
										flex: 1,
										flexDirection: 'row',
										height: '100%',
										alignItems: 'center',
										zIndex: 99
									}}>
										<Icon name="home" size={24} style={{marginLeft: 5, marginRight: 5}}/>
										<Liked track={this.state.listening?.item}/>
										{
											this.state.listening.is_playing
												?
												<TouchableHighlight
													onPress={() => {
														this._pause()
													}}
												>
													<Icon name="pause" size={24}
													      style={{marginLeft: 5, marginRight: 5, color: 'white'}}/>
												</TouchableHighlight>
												:
												<TouchableHighlight
													onPress={() => {
														this._play()
													}}
												>
													<Icon name="play" size={24}
													      style={{marginLeft: 5, marginRight: 5, color: 'white'}}/>
												</TouchableHighlight>

										}
									</View>
								</View>
								<View style={{flexDirection: 'row', marginTop: 5, width: '100%'}}>
									<Text
										numberOfLines={1}>{Math.floor((this.state.listening?.progress_ms / 1000 / 60) << 0)}:{Math.floor((this.state.listening?.progress_ms / 1000) % 60).toString().padStart(2, '0')}</Text>
									<View style={{
										height: 2,
										backgroundColor: 'tomato',
										flex: 1,
										alignSelf: 'center',
										marginLeft: 5,
										marginRight: 5
									}}>
										<View style={{
											height: 2,
											backgroundColor: 'grey',
											width: (this.state.listening?.progress_ms) / (this.state.listening?.item?.duration_ms) * 100 + "%"
										}}></View>
									</View>
									<Text>{Math.floor((this.state.listening?.item?.duration_ms / 1000 / 60) << 0)}:{Math.floor((this.state.listening?.item?.duration_ms / 1000) % 60).toString().padStart(2, '0')}</Text>
								</View>
							</View>
					}
				</TouchableOpacity>
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

export default connect(mapStateToProps)(Player);
