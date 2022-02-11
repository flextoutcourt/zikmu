import Icon from "react-native-vector-icons/FontAwesome5";
import {TouchableOpacity, Vibration} from "react-native";
import React from "react";
import {connect} from "react-redux";
import axios from "axios";

class Liked extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			liked: false,
		}
	}

	_check_like = (track_id) => {
		// if(track_id){
		// 	axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${track_id}`, {
		// 		headers: {
		// 			Accept: 'application/json',
		// 			Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
		// 			'Content-Type': 'application/json',
		// 		},
		// 		method: 'PUT',
		// 	})
		// 		.then(data => data.data)
		// 		.then(json => {
		// 			this.setState({
		// 				liked: json[0],
		// 			})
		// 		})
		// 		.catch(e => {
		// 			// alert(JSON.stringify(e));
		// 		});
		// }
		return false;
	}

	_like = (track_id) => {
		Vibration.vibrate(10);
		if (this.state.liked === false) {
			fetch(`https://api.spotify.com/v1/me/tracks?ids=${track_id}`, {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
					'Content-Type': 'application/json',
				}
			})
				.then(() => {
					this.setState({
						liked: true,
					})
				})
				.catch(e => alert(e))
		} else {
			//délike
			this._unlike(track_id);
		}
	}

	_unlike = (track_id) => {
		fetch(`https://api.spotify.com/v1/me/tracks?ids=${track_id}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
				'Content-Type': 'application/json',
			}
		})
			.then(() => {
				this.setState({
					liked: false,
				})
			})
			.catch(e => alert(JSON.stringify(e)));
	}

	componentDidMount() {
		this._check_like(this.props.track?.id)
	}

	render() {
		return (
			<TouchableOpacity onPress={() => this._like(this.props.track?.id)}>
				<Icon
					name="heart"
					size={this.props.iconSize ?? 24}
					solid={!!this.state.liked}
					color={this.state.liked ? '#B00D70' : 'white'}
					style={{color: this.state.liked ? '#B00D70' : 'white'}}
				/>
			</TouchableOpacity>
		)
	}

}

const mapStateToProps = store => {
	return {
		store: store,
	}
}

export default connect(mapStateToProps)(Liked);
