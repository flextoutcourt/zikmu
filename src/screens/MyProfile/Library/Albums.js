//import liraries
import axios from 'axios';
import React from 'react';
import {FlatList, StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import AlbumItem from '../../../components/Album/AlbumItem';

// create a component
class Albums extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			albums: null,
		};
	}

	_get_albums = (offset = 0) => {
		const promise = axios.get(
			`https://api.spotify.com/v1/me/albums?offset=${offset}`,
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

	_group_by_key = (array, f) => {
		let groups = [];
		array.map((item, key) => {
			if (groups[item.disc_number]) {
				groups[item.disc_number].data.push(item);
			} else {
				groups[item.disc_number] = {
					title: 'Disque ' + item.disc_number,
					data: [],
				};
				groups[item.disc_number].data.push(item);
			}
		});

		this.setState({disks: groups});
	};

	componentDidMount() {
		this._get_albums().then(data => this.setState({albums: data.items}));
	}

	render() {
		return (
			<LinearGradient
				colors={['#B00D72', '#5523BF']}
				style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
				<FlatList
					data={this.state.albums}
					scrollEnabled={true}
					horizontal={false}
					numColumns={2}
					onEndReachedThreshold={0.1}
					onEndReached={() => {
						this._get_albums(this.state.albums.length - 1).then(data => {
							this.setState({albums: [...this.state.albums, ...data.items]});
						});
					}}
					contentContainerStyle={{paddingBottom: 120}}
					renderItem={({item, key}) => <AlbumItem album={item?.album}/>}
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

export default connect(mapStateToProps)(Albums);
