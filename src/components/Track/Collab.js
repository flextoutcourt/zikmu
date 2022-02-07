import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Image, Text, View} from 'react-native';

class Collab extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isCollab: props.isCollab,
		}
	}

	_determine_image = user => {
		if(user?.images.length !== 0){
			return this._create_image(user, true);
		}else{
			return this._create_image(user, false);
		}
	}

	_create_image = (user, image) => {
		return (
			image
			?
				<Image source={{uri: user?.images[0].url}} style={{width: '100%', height: '100%', borderRadius: 50}}/>
			:
			<View style={{height: "100%", width: "100%", alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: 'red'}}>
				<Text>{user?.display_name.substr(0, 1).toUpperCase()}</Text>
			</View>
		)
	}

	componentDidMount() {

	}

	render() {
		return (
			<View style={{alignSelf: 'flex-end', marginRight: 10, elevation: 10, width: 36, height: 36}}>
				{
					this._determine_image(this.props.collab)
				}
			</View>
		);
	}
}

const mapStateToProps = store => {
	return {
		store: store
	}
}

export default connect(mapStateToProps)(Collab);
