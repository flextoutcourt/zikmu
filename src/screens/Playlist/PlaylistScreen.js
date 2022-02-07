import axios from 'axios';
import React from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Animated, {Extrapolate} from 'react-native-reanimated';
import {connect} from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';
import Header from '../../components/Playlist/Header';

class PlaylistScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			playlist: null,
			scrollY: new Animated.Value(0),
			englithment: null
		};
	}

	_get_playlist = () => {
		const promise = axios.get(
			'https://api.spotify.com/v1/playlists/' +
			this.props.route.params.playlist_id,
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

	_to_array_tracks = () => {
		let tracks_array = [];
		this.state.playlist?.tracks.items.map(item => {
			tracks_array.push(item.track?.id);
		});
		return tracks_array.toString();
	}
	_to_array_genres = () => {
		let genre_array = [];
		this.state.playlist?.tracks.items.map(item => {
			genre_array.push(item.genre.id)
		});
		return genre_array.toString();
	}
	_to_array_artists = () => {
		let artist_array = [];
		this.state.playlist?.tracks.items.map(item => {
			item.track.artists.map((artist) => {
				artist_array.push(artist.id);
			})
		});
		return artist_array.toString();
	}

	_enlight_playlist = () => {
		console.log(this._to_array_artists());
		const promise = axios.get(
			`https://api.spotify.com/v1/recommendations?seed_tracks=${this.state.playlist.tracks.items[0].track.id}&limit=10`,
			{
				headers: {
					Accept: 'application/json',
					Authorization:
						'Bearer ' + this.props.store.authentication.accessToken,
					'Content-Type': 'application/json',
				},
			},
		);
        return promise.then(data => alert(JSON.stringify(data)));
	}

	_get_user = (href) => {
		const promise = axios.get(
			`${href}`,
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
	}

	componentDidMount() {
		const opacity = this.state.scrollY.interpolate({
			inputRange: [250, 325],
			outputRange: [0, 0.5],
			extrapolate: Extrapolate.CLAMP,
		});
		this._get_playlist().then(json => {
			this.setState({playlist: json});
			if(json.collaborative){
				let users = [];
				json.tracks?.items?.map((item, key) => {
					if(users.indexOf(item?.added_by?.href) === -1){
						users.push(item?.added_by?.href);
					}
				})
				let users_array = [];
				users?.map((item, key) => {
					this._get_user(item).then(json => {
						users_array.push(json);
					});

				});
				this.setState((prevState) => ({
					...prevState,
					playlist:{
						...prevState.playlist,
						collab_users: {
							users_array,
						}
					}
				}))
			}
		});

	}

	render() {
		const scale = this.state.scrollY.interpolate({
			inputRange: [-Dimensions.get('screen').height, 0, 125],
			outputRange: [2, 1, 0.5],
			extrapolateRight: Extrapolate.CLAMP,
		});
		const opacity = this.state.scrollY.interpolate({
			inputRange: [0, 200],
			outputRange: [1, 1],
			extrapolate: Extrapolate.CLAMP,
		});
		const mb = this.state.scrollY.interpolate({
			inputRange: [0, 125],
			outputRange: [10, -75],
			extrapolate: Extrapolate.CLAMP,
		});

		const br = this.state.scrollY.interpolate({
			inputRange: [0, 10],
			outputRange: [0, 10],
			extrapolate: Extrapolate.CLAMP,
		});

		const height = this.state.scrollY.interpolate({
			inputRange: [0, 125],
			outputRange: [Dimensions.get('screen').width, Dimensions.get('screen').width],
			extrapolate: Extrapolate.CLAMP
		});

		const mt = this.state.scrollY.interpolate({
			inputRange: [0, 125],
			outputRange: [0, 125],
			extrapolate: Extrapolate.CLAMP
		});

		const transform = [{scale}];
		return (
			<LinearGradient
				colors={['#B00D72', '#5523BF']}
				style={{
					marginTop: -StatusBar.currentHeight,
					...styles.container,
					paddingTop: StatusBar.currentHeight,
				}}>
				<Header
					y={this.state.scrollY}
					playlist={this.state.playlist}
					{...this.props}
				/>
				<Animated.ScrollView
					style={{marginTop: -2.5 * StatusBar.currentHeight}}
					onScroll={Animated.event(
						[{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
						{listener: '', useNativeDriver: true},
					)}
					scrollEventThrottle={16}>
					{this.state.playlist ? (
						<FlatList
							data={this.state.playlist?.tracks?.items}
							scrollEnabled={false}
							horizontal={false}
							ListHeaderComponent={() => (
								<Animated.View style={{}}>
									<Animated.View
										style={{
											alignItems: 'flex-start',
											justifyContent: 'flex-start',
											elevation: 10,
											marginBottom: mb,
											marginTop: mt,
											transform: transform,
											width: height,
											height: height,
											position: 'relative',
											opacity: opacity,
										}}>
										<Animated.Image
											source={{uri: this.state.playlist?.images[0]?.url}}
											style={{width: '100%', height: '100%', borderRadius: br}}
										/>
										<Animated.Text
											style={{
												position: 'absolute',
												bottom: 5,
												left: 10,
												backgroundColor: 'red',
												borderRadius: 9,
												padding: 5,
												elevation: 10,
												opacity: opacity,
											}}>
											{this.state.playlist?.followers?.total} {this.state.playlist?.followers?.total > 1 ? 'Followers' : 'Follower'}
										</Animated.Text>
									</Animated.View>
									<Animated.View style={{opacity: opacity}}>
										<Text
											style={{
												textAlign: 'center',
												fontSize: 28,
												color: 'white',
											}}>
											{this.state.playlist?.name}
										</Text>
									</Animated.View>
									<View style={{
										flexDirection: 'row',
										justifyContent: 'flex-start',
										alignItems: 'flex-start'
									}}>
										<View style={{
											padding: 10,
											alignItems: 'flex-start',
											justifyContent: 'flex-start'
										}}>
											<TouchableOpacity
												onPress={() => this._enlight_playlist().then(json => alert(JSON.stringify(json)))}
												style={{
													borderStyle: 'solid',
													borderRadius: 100,
													borderColor: "white",
													borderWidth: 1,
													paddingHorizontal: 10,
													paddingVertical: 5,
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'center'
												}}>
												<FontAwesome5Icon name="lightbulb" size={16} color="white"
												                  style={{marginRight: 5}}/>
												<Text style={{color: 'white'}}>
													Enrichir
												</Text>
											</TouchableOpacity>
										</View>
										<View style={{
											padding: 5,
											paddingVertical: 10,
											alignItems: 'flex-start',
											justifyContent: 'flex-start'
										}}>
											<TouchableOpacity onPress={() => alert('telecharger la playlist')} style={{
												padding: 5,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
												<FontAwesome5Icon name="download" size={16} color="white"
												                  style={{marginRight: 5}}/>
											</TouchableOpacity>
										</View>
										<View style={{
											padding: 5,
											paddingVertical: 10,
											alignItems: 'flex-start',
											justifyContent: 'flex-start'
										}}>
											<TouchableOpacity onPress={() => alert('Ajouter un collaborateur')} style={{
												padding: 5,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
												<FontAwesome5Icon name="user-plus" size={16} color="white"
												                  style={{marginRight: 5}}/>
											</TouchableOpacity>
										</View>
										<View style={{
											padding: 5,
											paddingVertical: 10,
											alignItems: 'flex-start',
											justifyContent: 'flex-start'
										}}>
											<TouchableOpacity onPress={() => alert('Voir les détails')} style={{
												padding: 5,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
												<FontAwesome5Icon name="ellipsis-v" size={16} color="white"
												                  style={{marginRight: 5}}/>
											</TouchableOpacity>
										</View>
									</View>
									<View style={{
										flex: 1,
										padding: 10,
										marginVertical: 10,
										alignItems: 'center',
										justifyContent: 'flex-start'
									}}>
										<TouchableOpacity
											onPress={() => this._enlight_playlist().then(json => alert(JSON.stringify(json)))}
											style={{
												borderStyle: 'solid',
												borderRadius: 100,
												borderColor: "white",
												borderWidth: 1,
												paddingHorizontal: 10,
												paddingVertical: 5,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
											<FontAwesome5Icon name="plus" size={16} color="white"
											                  style={{marginRight: 5}}/>
											<Text style={{color: 'white'}}>
												Ajouter des titres
											</Text>
										</TouchableOpacity>
									</View>
								</Animated.View>
							)}
							renderItem={({item, key, index}) => (
								<TouchableOpacity
									onPress={() =>
										navigation.navigate('Playlist', {
											playlist_id: item.track.id,
										})
									}>
									<TrackItem
										track={item?.track}
										album={item?.track?.album}
										playlist={this.state.playlist}
										collab_users={this.state.playlist?.collab_users}
										added_by={item.added_by}
										type={'playlist'}
										playlist_uri={this.state.playlist?.uri}
										playlist_index={index}
									/>
								</TouchableOpacity>
							)}
						/>
					) : null}
					<LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: 25, padding: 10}}>
						<View style={{padding: 10, alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
							<TouchableOpacity
								onPress={() => this._enlight_playlist().then(json => alert(JSON.stringify(json)))}
								style={{
									paddingHorizontal: 10,
									paddingVertical: 5,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
								<Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>
									Nos Suggestions
								</Text>
							</TouchableOpacity>
							<FlatList
								data={this.state.suggested?.tracks?.items}
								keyExtractor={(item, index) => index.toString()}
								renderItem={(item, key) => (
									<TrackItem track={item.track}/>
								)}
							/>
							<View style={{height: 800, width: Dimensions.get('screen').width - 20}}>

							</View>
						</View>
					</LinearGradient>
				</Animated.ScrollView>
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

export default connect(mapStateToProps)(PlaylistScreen);
