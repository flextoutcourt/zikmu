import axios from 'axios';
import React from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import GenreItem from '../../components/Genres/GenreItem';

class GenreList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			genres: null,
		};
	}

	_get_available_genres = () => {
		const promise = axios.get(
			`https://api.spotify.com/v1/browse/categories?country=FR`,
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
		this._get_available_genres().then(json => this.setState({genres: json}));
	}

	render() {
		return (
			<FlatList
				data={this.state.genres?.categories?.items}
				numColumns={3}
				renderItem={(item, key) => <GenreItem genre={item}/>}
			/>
		);
	}
}

const mapStateToProps = store => {
	return {
		store: store,
	};
};

export default connect(mapStateToProps)(GenreList);
