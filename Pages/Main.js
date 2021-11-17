import React, {useState, useEffect} from 'react';
import {FlatList, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, ScrollView, ListView, Linking, TouchableOpacity, Button} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import queryString from 'query-string';
import { useNavigation } from '@react-navigation/core';

import authHandler from './../src/utils/authenticationHandler';

const Main = () => {

	const navigation = useNavigation();

	const [tracks, setTracks] = useState([]);
	const [genres, setGenres] = useState([]);
	const [recent, setRecent] = useState([]);

	const _get_tracks = (offset = 0) => {
		const promise = fetch(`https://api.spotify.com/v1/me/tracks?market=FR&offset=${offset}`, {
			headers: {
				Accept: "application/json",
				Authorization: Token.Token,
				"Content-Type": "application/json"
			}
		});
		const responseData = promise.then((data) => data.json());
		return responseData;
	}

	const _get_recent = (offset = 0) => {
		const promise = axios.get(`https://api.spotify.com/v1/me/player/recently-played?offset=${offset}`, {
			headers: {
				Accept: "application/json",
				Authorization: Token.Token,
				"Content-Type": "application/json"
			}
		});
		const response = promise.then(data => data.data);
		return response;
	}

	const _get_genres = (offset = 0) => {
			const promise = fetch("https://api.spotify.com/v1/browse/categories", {
				headers: {
					Accept: "application/json",
					Authorization: Token.Token,
					"Content-Type": "application/json"
				}
			});
			const responseData = promise.then((data) => data.json());
			return responseData;
	}

	useEffect(() => {
		// _get_tracks().then(json => {
		// 	setTracks(json.items);
		// });
		// _get_genres().then((json) => {
		// 	// console.log(json.items)
		// 	setGenres(json.categories.items);
		// })
		// _get_recent().then(json => {
		// 	setRecent(json.items);
		// })
	}, []);

	return (
		<View style={{flex: 1}}>
			{/* <ScrollView>
				<Text>
					test
				</Text>
				<FlatList
					style={{display: "flex", flexDirection:'row'}}
					data={tracks}
					scrollEnabled={true}
					horizontal={true}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						_get_tracks(tracks.length).then((json) => setTracks(tracks => [...tracks, json.items]))
					}}
					renderItem={({item, key}) => (
						<TouchableOpacity onPress={() => {}}>
							<View style={{width: 116, padding: 0, backgroundColor: 'transparent', margin: 5}}>
								<Image source={{uri: item?.track?.album?.images[0]?.url}}
								style={{width: 116, height: 116, margin: "auto"}} />
								<View>
									<Text style={{fontWeight: 'bold', color: 'white'}}>{item?.track?.artists[0]?.name}</Text>
									<Text style={{maxWidth: 150}}>{item?.track?.name}</Text>
								</View>
							</View>
						</TouchableOpacity>
					)}
				/>
				<FlatList
					data={genres}
					scrollEnabled={true}
					horizontal={true}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						_get_genres(genres.length).then(json => setGenres(genres => [...genres, json.categories.items]))
					}}
					renderItem={({item, key}) => (
						<TouchableOpacity onPress={() => navigation.navigate('Category', {
							category_id: item.id
						})}>
							<View style={{width: 116, padding: 0, backgroundColor: 'transparent', margin: 5}}>
								<Image source={{uri: item?.icons[0]?.url}}
								style={{width: 116, height: 116, margin: "auto"}} />
								<View>
									<Text style={{fontWeight: 'bold', color: 'white'}}>{item?.name}</Text>
								</View>
							</View>
						</TouchableOpacity>
					)}
				/>
				<FlatList
					style={{display: "flex", flexDirection:'row'}}
					data={recent}
					scrollEnabled={true}
					horizontal={true}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						_get_recent(recent.length).then(json => setRecent(recent => [...recent, json.items]))
					}}
					renderItem={({item, key}) => (
						<View style={{width: 116, padding: 0, backgroundColor: 'transparent', margin: 5}}>
							<Image source={{uri: item?.track?.album?.images[0]?.url}}
							style={{width: 116, height: 116, margin: "auto"}} />
							<View>
								<Text style={{fontWeight: 'bold', color: 'white'}}>{item?.track?.artists[0]?.name}</Text>
								<Text style={{maxWidth: 150}}>{item?.track?.name}</Text>
							</View>
						</View>
					)}
				/>
			</ScrollView> */}
			<Button onPress={() => authHandler.onLogin()} title="Press to login"/>
		</View>
	);
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  }
});

export default Main;