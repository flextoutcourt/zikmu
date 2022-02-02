//import liraries
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import TrackItem from '../../../components/Track/TrackItem';
import axios from 'axios';

class Tracks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tracks: null,
		};
		props.navigation.setOptions({
			title: 'Mes favoris',
		});
	}

	_get_tracks = (offset = 0) => {
		const promise = axios.get('https://api.spotify.com/v1/me/tracks', {
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
				'Content-Type': 'application/json',
			},
		});
        return promise.then(data => data);
	};

	componentDidMount() {
		this._get_tracks().then(data => this.setState({tracks: data.data}));
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					data={tracks?.items}
					scrollEnabled={true}
					horizontal={false}
					onEndReachedThreshold={0.1}
					onEndReached={() => {
						this._get_tracks(this.state.tracks.length).then(json =>
							this.setState(tracks => {tracks: tracks?.items?.concat(json.items)}),
						);
					}}
					renderItem={({item, key}) => (
						<TrackItem
							track={item.track}
							album={item?.track?.album}
							favorites={true}
						/>
					)}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2c3e50',
	},
});

const mapStateToProps = store => {
	return {
		store: store,
	};
};

export default connect(mapStateToProps)(Tracks);
