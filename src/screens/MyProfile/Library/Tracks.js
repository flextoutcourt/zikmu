//import liraries
import React from 'react';
import {ActivityIndicator, Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import TrackItem from '../../../components/Track/TrackItem';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

class Tracks extends React.PureComponent {
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
		const promise = axios.get(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
				'Content-Type': 'application/json',
			},
		});
        return promise.then(data => data.data);
	};

	componentDidMount() {
		this._get_tracks().then(data => this.setState({tracks: data.items}));
	}

	_get_liked_count = () => {
		return 1777;
	}

	render() {
		return (
			<LinearGradient
				colors={['#34495e', '#34495e']}
				style={{...styles.container}}>
				<FlatList
					data={this.state.tracks}
					scrollEnabled={true}
					horizontal={false}
					style={{paddingTop: StatusBar.currentHeight}}
					contentContainerStyle={{paddingBottom: 150}}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						this._get_tracks(this.state.tracks.length - 1).then(data => {
							this.setState({
								tracks: [...this.state.tracks, ...data.items]
							})
						})
					}}
					ListFooterComponent={() => (
						<ActivityIndicator size={'large'} />
					)}
					renderItem={({item, key}) => (
						<TrackItem
							track={item.track}
							album={item?.track?.album}
							favorites={true}
						/>
					)}
				/>
			</LinearGradient>
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
