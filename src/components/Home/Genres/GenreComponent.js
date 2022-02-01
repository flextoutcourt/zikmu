import axios from 'axios';
import React, {Component} from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';

class GenreComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			genres: null,
		};
	}

	_get_genres = (offset = 0) => {
		console.log('genres');
		const promise = axios.get(
			`https://api.spotify.com/v1/browse/categories?offset=${offset}`,
			{
				headers: {
					Accept: 'application/json',
					Authorization:
						'Bearer ' + this.props.store.authentication.accessToken,
					'Content-Type': 'application/json',
				},
			},
		);
		const response = promise.then(data => data.data);
		return response;
	};

	componentDidMount() {
		this._get_genres().then(data => {
			console.log(data);
			this.setState({genres: data});
		});
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.state.genres?.categories?.items}
					scrollEnabled={true}
					horizontal={true}
					// onEndReachedThreshold={0.5}
					// onEndReached={() => {
					//     _get_genres(this.state.genres.categories.items.length - 1).then(json => setGenres(genres => genres.concat(json.categories.items)))
					// }}
					renderItem={({item, key}) => <Text>{item?.id}</Text>}
				/>
			</View>
		);
	}
}

const mapStateToProps = store => {
	return {
		store: store,
	};
};

export default connect(mapStateToProps)(GenreComponent);
