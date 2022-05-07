//import liraries
import axios from 'axios';
import React from 'react';
import {FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import PlaylistItem from '../../../components/Playlist/PlaylistItem';
import * as rootNavigation from './../../../utils/RootNavigation';

const {width} = Dimensions.get('screen');

// create a component
class Playlists extends React.PureComponent {
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
				colors={['#34495e', '#34495e']}
				style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
				<FlatList
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
					ListHeaderComponent={() => (
						<LinearGradient colors={['#34495e','#34495e', "transparent"]} style={{elevation: 10}}>
                            <TouchableOpacity onPress={() => alert('test')}>
                                <LinearGradient colors={['#ff00cc', '#333399']} useAngle={true} angle={145} style={{flex: 1, height: 50, width: width - 10, margin: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: "white", fontSize: 18, fontWeight: 'bold'}}>Ajouter une playlist</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('MyTracks')
                            }}>
                                <LinearGradient colors={['#403A3E', '#BE5869']} useAngle={true} angle={270} style={{flex: 1, height: 50, width: width - 10, margin: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: "white", fontSize: 18, fontWeight: 'bold'}}>Mes titres likés</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
					)}
					data={this.state.playlists}
					scrollEnabled={true}
					horizontal={false}
					onEndReachedThreshold={0.1}
					onEndReached={() => {
						this._get_playlists(this.state.playlists.length).then(data => {
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
