import axios from 'axios';
import React, {Component} from 'react';
import {Dimensions, FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import GenreItem from '../../Home/Genres/GenreItem';

class GenreComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			genres: null,
		};
	}

	_get_genres = (offset = 0) => {
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
        return promise.then(data => data.data);
	};

	componentDidMount() {
		this._get_genres().then(data => {
			this.setState({genres: data});
		});
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 5, marginLeft: 10}}>Succeptible de vous plaire</Text>
				<FlatList
					data={this.state.genres?.categories?.items}
					scrollEnabled={true}
					horizontal={true}
					renderItem={({item, key}) => <GenreItem genre={item} {...this.props} />}
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
