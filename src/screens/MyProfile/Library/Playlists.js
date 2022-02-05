//import liraries
import axios from 'axios';
import React from 'react';
import {FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import PlaylistItem from '../../../components/Playlist/PlaylistItem';
import * as rootNavigation from './../../../utils/RootNavigation';


// create a component
class Playlists extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			playlists: null,
		};
	}

	_get_playlists = (offset = 0) => {
		const promise = axios.get(
			`https://api.spotify.com/v1/me/playlists?offset=${offset}`,
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
		this._get_playlists().then(data => this.setState({playlists: data.items}));
	}

	render() {
		return (
			<LinearGradient
				colors={['#B00D72', '#5523BF']}
				style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
				<FlatList
					ListHeaderComponent={() => (
						<TouchableOpacity
							onPress={() => {
								rootNavigation.push('MyTracks');
							}}>
							<View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 5, marginTop: 10, marginBottom: 5}}>
								<View style={{backgroundColor: 'black', borderRadius: 10, width: 48, height: 48, elevation: 10}}>
									<Image source={{uri: 'https://picsum.photos/150'}} style={{height: 48, width: 48, borderRadius: 10}} />
								</View>
								<Text style={{marginLeft: 15, fontWeight: 'bold', color: 'white'}}>Mes titres likés</Text>
							</View>
						</TouchableOpacity>
					)}
					data={this.state.playlists}
					scrollEnabled={true}
					horizontal={false}
					onEndReachedThreshold={0.1}
					onEndReached={() => {
						this._get_playlists(this.state.playlists.length - 1).then(data => {
							this.setState({
								playlists: [...this.state.playlists, ...data.items],
							});
						});
					}}
					renderItem={({item, key}) => <PlaylistItem playlist={item}/>}
					contentContainerStyle={{paddingBottom: 120}}
				/>
			</LinearGradient>
		);
	}
}

// define your styles
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

export default connect(mapStateToProps)(Playlists);
