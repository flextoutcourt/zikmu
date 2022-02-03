import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {connect} from 'react-redux';

class Miniplayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listening: false,
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
        return promise.then(data => data.data);
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

	render() {
		console.log('test');
		return (
			<View
				style={{
					margin: 0,
					backgroundColor: 'red',
					borderTopRightRadius: 10,
					borderTopLeftRadius: 10,
					padding: 10,
				}}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							flex: 3,
							overflow: 'hidden',
						}}>
						<Image
							source={{uri: this.state.listening?.item?.album?.images[0]?.url}}
							style={{width: 50, height: 50, margin: 'auto', borderRadius: 10}}
						/>
						<View style={{marginLeft: 5}}>
							<Text style={{color: 'white'}}>
								{this.state.listening?.item?.name}
							</Text>
							<Text style={{color: 'lightgrey'}}>
								{this.state.listening?.item?.artists[0]?.name}
							</Text>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							height: '100%',
							alignItems: 'center',
							zIndex: 99,
						}}>
						<Icon
							name="home"
							size={24}
							style={{marginLeft: 5, marginRight: 5}}
						/>
						<Icon
							name="heart"
							size={24}
							style={{marginLeft: 5, marginRight: 5, color: 'white'}}
						/>
						{this.state.listening.is_playing ? (
							<TouchableHighlight
								onPress={() => {
									this._pause();
								}}>
								<Icon
									name="pause"
									size={24}
									style={{marginLeft: 5, marginRight: 5, color: 'white'}}
								/>
							</TouchableHighlight>
						) : (
							<TouchableHighlight
								onPress={() => {
									this._play();
								}}>
								<Icon
									name="play"
									size={24}
									style={{marginLeft: 5, marginRight: 5, color: 'white'}}
								/>
							</TouchableHighlight>
						)}
					</View>
				</View>
				<View style={{flexDirection: 'row', marginTop: 5, width: '100%'}}>
					<Text>
						{Math.floor((this.state.listening?.progress_ms / 1000 / 60) << 0)}:
						{Math.floor((this.state.listening?.progress_ms / 1000) % 60)
							.toString()
							.padStart(2, '0')}
					</Text>
					<View
						style={{
							height: 2,
							backgroundColor: 'tomato',
							flex: 1,
							alignSelf: 'center',
							marginLeft: 5,
							marginRight: 5,
						}}>
						<View
							style={{
								height: 2,
								backgroundColor: 'grey',
								width:
									(this.state.listening?.progress_ms /
										this.state.listening?.item?.duration_ms) *
									100 +
									'%',
							}}
						/>
					</View>
					<Text>
						{Math.floor(
							(this.state.listening?.item?.duration_ms / 1000 / 60) << 0,
						)}
						:
						{Math.floor((this.state.listening?.item?.duration_ms / 1000) % 60)
							.toString()
							.padStart(2, '0')}
					</Text>
				</View>
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

export default connect(mapStateToProps)(Miniplayer);
