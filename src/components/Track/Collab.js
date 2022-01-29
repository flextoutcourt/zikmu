import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, StyleSheet, TouchableOpacity, Image, Text, Dimensions} from 'react-native';
import * as rootNavigation from '../../utils/RootNavigation'

class Collab extends Component {

	constructor(props){
		super(props);
		this.state = {
			isCollab: props.isCollab,
		}
	}

	componentDidMount(){

	}

	render() {
		return (
			this.state.isCollab
			?
				<View style={{alignSelf: 'flex-end', marginRight: 10, elevation: 10, width: 36, height: 36}}>
					<Image source={{uri: 'https://picsum.photos/48/48'}} style={{width: '100%', height: '100%', borderRadius: 50}} />
				</View>
			:
				null
		);
	}
}

const mapStateToProps = store => {
	return{
		store: store
	}
}

export default connect(mapStateToProps)(Collab);
