import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import RecentComponent from '../../components/Home/Recents/RecentComponent';
import GenreComponent from '../../components/Home/Genres/GenreComponent';
import ReleaseComponent from '../../components/Home/Release/ReleaseComponent';
import FollowComponent from '../../components/Home/Follows/FollowComponent';
import PlayerAlt from '../../components/Global/PlayerAlt';
import {SharedElement} from 'react-navigation-shared-element';

class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	_display_message = () => {
		let now = parseInt(new Date().getHours());
		let message = null;
		switch (true) {
			case (now < 2):
				message = 'Faut dormir';
				break;
			case (now < 8):
				message = 'Bien matinal';
				break;
			case (now < 10):
				message = 'Bien dormi ?';
				break;
			case (now < 12):
				message = 'Bonjour';
				break;
			case (now < 14 || (now >= 19 && now <= 21)):
				message = 'Bon appétit';
				break;
			case (now < 18):
				message = 'Bonjour';
				break;
			case (now < 24):
				message = 'Bonsoir';
				break;
		}
		return message;
	}

	render() {

		const stories = [
			{
				id: 1,
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			},
			{
				id: 2,
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			},
			{
				id: 3,
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			},
			{
				id: 4,
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			},
			{
				id: 5,
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			},
			{
				id: 6,
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			}
		];

		return (
			<LinearGradient
				colors={['#B00D72', '#5523BF']}
				style={{
					marginTop: 0,
					...styles.container,
				}}>
				<View style={{borderBottomWidth: 1, borderColor: 'red'}}>
					<ScrollView horizontal={true} style={{ paddingTop: StatusBar.currentHeight + 10, paddingBottom: 10}}>
						{stories.map((story, key) => (
							<TouchableOpacity onPress={() => this.props.navigation.navigate('Story', {
								story: story
							})} style={styles.stories.imageContainer}>
								<SharedElement id={story.id} style={{...StyleSheet.absoluteFill}}>
									<Image source={{uri: story.picture}} style={styles.stories.image}/>
								</SharedElement>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
				<ScrollView style={{flex: 1, paddingBottom: 155}}>
					<View style={{flex: 1, paddingVertical: 20, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
						<Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this._display_message()}</Text>
						<View style={{flexDirection: 'row'}}>
							{/*<TouchableOpacity onPress={() => alert('settings')} style={{marginLeft: 20}}>*/}
							{/*	<Icon name={'settings'} solid={true} size={24} color={'white'} />*/}
							{/*</TouchableOpacity>*/}
							<TouchableOpacity onPress={() => this.props.navigation.push('Self')} style={{marginLeft: 20}}>
								<Icon name={'settings'} solid={true} size={24} color={'white'} />
							</TouchableOpacity>
						</View>
					</View>
					<RecentComponent {...this.props} isTop={true}/>
					<ReleaseComponent {...this.props} />
					<GenreComponent {...this.props} />
					<RecentComponent {...this.props} isTop={false} />
					<FollowComponent {...this.props} />
				</ScrollView>
			</LinearGradient>
		);
	}
}

const mapStateToProps = store => {
	return {
		store: store,
	};
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2c3e50',
	},
	stories: {
		image: {
			...StyleSheet.absoluteFill,
			borderRadius: 64
		},
		imageContainer: {
			borderRadius: 64,
			width: 64,
			height: 64,
			elevation: 10,
			marginHorizontal: 10,
			borderColor: 'white',
			borderWidth: 2,
			overflow: 'hidden'
		}
	}
});

export default connect(mapStateToProps)(HomeScreen);
