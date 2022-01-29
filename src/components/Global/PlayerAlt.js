import React from 'react';
import {Image, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import * as rootNavigation from "../../utils/RootNavigation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome5";
import Liked from "../Track/Liked";
import axios from "axios";
import {connect} from "react-redux";
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

class PlayerAlt extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			listening: null,
			paroles: false,
			big: false
		}
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
		const response = promise.then(data => data.data);
		return response;
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
					<TouchableOpacity style={{position: 'absolute', bottom: 100, left: 3, right: 3, backgroundColor: 'red', borderRadius: 10}} onPress={() => alert('test')}>
						<View style={{margin: 10}}>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<View style={{flexDirection: 'row', alignItems: 'center', flex: 3, overflow: 'hidden'}}>
									<Image source={{uri: this.state.listening?.item?.album?.images[0]?.url}} style={{width: 40, height: 40, margin: "auto", borderRadius: 10}} />
									<View>
										<View style={{marginLeft: 5, flexDirection: 'row'}}>
											<Text style={{color: 'white'}} numberOfLines={1}>{this.state.listening?.item?.name}</Text>
											<Text> - </Text>
											<TouchableOpacity onPress={() => rootNavigation.navigate('Artist', {
												artist_id: this.state.listening?.item?.artists[0].id
											})}>
												<Text style={{color: 'white'}}>{this.state.listening?.item?.artists[0]?.name}</Text>
											</TouchableOpacity>
										</View>
										<View style={{marginLeft: 5, flexDirection: 'row', marginTop: 2, alignItems: 'center'}}>
											<FontAwesome name={this._display_device_icon(this.state.listening?.device?.type)} size={16} style={{color: '#B00D70', fontWeight: 'bold'}} />
											<Text style={{marginLeft: 5, color: "#B00D70", fontWeight: 'bold'}}>{this.state.listening?.device?.name}</Text>
										</View>
									</View>
								</View>
								<View style={{flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'flex-end', zIndex: 99}}>
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
								</View>
							</View>
							<View style={{flexDirection: 'row', marginTop: 5, width: '100%', position: 'absolute', bottom: -10, left: 0, right: 0}}>
								<View style={{height: 2, backgroundColor: 'grey', flex: 1, alignSelf: 'center', borderRadius: 5}}>
									<View style={{height: 2, backgroundColor: 'white', width: (this.state.listening?.progress_ms) / (this.state.listening?.item?.duration_ms) * 100 + "%", borderRadius: 5}}></View>
								</View>
							</View>
						</View>
					</TouchableOpacity>
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