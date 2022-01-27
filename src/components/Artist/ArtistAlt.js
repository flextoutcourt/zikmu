import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, StyleSheet, TouchableOpacity, Image, Text, Dimensions} from 'react-native';

class ArtistAlt extends Component {

	constructor(props){
		super(props);
		this.state = {
			artist: null
		}
	}

	componentDidMount(){
		this._get_artist(this.props.artist?.id).then(j => {
			this.setState({artist: j});
		})
	}

	_get_artist = (artist_id) => {
		const promise = axios.get(`https://api.spotify.com/v1/artists/${artist_id}`, {
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer '+ this.props.store.authentication.accessToken,
				"Content-Type": 'application/json'
			}
		});
		const response = promise.then(data => data.data);
		return response;
	}

	render() {
		return (
			<TouchableOpacity
				onPress={() => {
					this.props.navigation.navigate('Artist', {
						artist_id: this.props.artist?.id
					})
				}}
				style={{flexDirection: 'column', alignItems: 'center'}}
			>
				<Image source={{uri: this.state.artist?.images[2]?.url}} style={{...styles.images, borderRadius: this.state.artist?.images[2].height}} />
				<Text style={{color: 'white', fontSize: 16, fontWeight: "800"}}>{this.state.artist?.name}</Text>
			</TouchableOpacity>
		);
	}
}

const numItems = 3;
const margin = 10;

const styles = StyleSheet.create({
	images: {
		height: (Dimensions.get('screen').width - margin * numItems * 2) / numItems,
		width: (Dimensions.get('screen').width - margin * numItems * 2) / numItems,
		marginRight: margin + (margin * 0.5)
	}
})

const mapStateToProps = store => {
	return{
		store: store
	}
}

export default connect(mapStateToProps)(ArtistAlt);
