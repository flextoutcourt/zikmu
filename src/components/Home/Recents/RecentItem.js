import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import TrackItem from '../../Track/TrackItem';

class Recentitem extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	_play = (uri, offset = 0, position = 0) => {
		console.log(uri, offset, position);
		fetch('https://api.spotify.com/v1/me/player/play', {
			body: JSON.stringify({uris: [uri]}),
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
				'Content-Type': 'application/json',
			},
			method: 'PUT',
		}).catch(e => {
			alert(JSON.stringify(e));
		});
	};

	_margin = () => {
		if(this.props.iterator % 2){
			return {marginLeft: 5, marginRight: 10, marginVertical: 5};
		}else{
			return {marginLeft: 10, marginRight: 5, marginVertical: 5};
		}
	}

	componentDidMount(){
	}

	render() {
		return (
			this.props.isTop
			?
				<View style={{...this._margin()}}>
					<View style={{width: Dimensions.get('screen').width /2 - 15, borderRadius: 10, borderBottomRightRadius:0, backgroundColor: '#2f3640', minHeight: 50}}>
						<TouchableOpacity
							onPress={() => {
								this.props.navigation.push('Album', {
									album_id: this.props.recent?.track?.album?.id
								})
							}}
							style={{flexDirection: 'row', alignItems: 'center'}}
						>
							<View>
								<View style={{elevation: 10, backgroundColor: 'black', width: 50, height: 50, borderRadius: 10}}>
									<Image source={{uri: this.props.recent?.track?.album?.images[0]?.url}} style={{borderTopLeftRadius: 10, ...StyleSheet.absoluteFill}} />
								</View>
							</View>
							<View style={{marginLeft: 5}}>
								<Text numberOfLines={1} style={{maxWidth: (Dimensions.get('screen').width / 2) - 73, color: 'white'}}>{this.props.recent?.track?.album?.name}</Text>
								<Text>{this.props.recent?.track?.artists[0]?.name}</Text>
							</View>
						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => this._play(this.props.recent?.track?.uri)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
						<View style={{marginLeft: 0, backgroundColor: '#2c3e50', padding: 5, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
							<FontAwesome5Icon name={'play-circle'} size={12} color='white' style={{marginRight: 10}}/>
							<Text numberOfLines={1} style={{maxWidth: "90%"}}>{this.props.recent?.track?.name}</Text>
						</View>
					</TouchableOpacity>
				</View>
			:
				<View style={{width: Dimensions.get('screen').width / 2, borderRadius: 10, minHeight: 50, ...this._margin()}}>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.push('Album', {
								album_id: this.props.recent?.track?.album?.id
							})
						}}
						style={{flexDirection: 'column', alignItems: 'center'}}
					>
						<View style={{}}>
							<View style={{elevation: 10, backgroundColor: 'black', borderRadius: 10}}>
								<View style={{elevation: 10, backgroundColor: 'black', width: Dimensions.get('screen').width / 2, height: Dimensions.get('screen').width / 2, borderRadius: 10}}>
									<Image source={{uri: this.props.recent?.track?.album?.images[0]?.url}} style={{borderRadius: 10, ...StyleSheet.absoluteFill}} />
								</View>
							</View>
							<View style={{padding: 5}}>
								<Text numberOfLines={1} style={{maxWidth: (Dimensions.get('screen').width / 2) - 73, color: 'white'}}>{this.props.recent?.track?.name}</Text>
								<Text>{this.props.recent?.track?.artists[0]?.name}</Text>
							</View>
						</View>
					</TouchableOpacity>
					{/*<TouchableOpacity onPress={() => this._play(this.props.recent?.track?.uri)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>*/}
					{/*	<View style={{marginLeft: 0, backgroundColor: '#2c3e50', padding: 5, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>*/}
					{/*		<FontAwesome5Icon name={'play-circle'} size={12} color='white' style={{marginRight: 10}}/>*/}
					{/*		<Text>{this.props.recent?.track?.name}</Text>*/}
					{/*	</View>*/}
					{/*</TouchableOpacity>*/}
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

export default connect(mapStateToProps)(Recentitem);
