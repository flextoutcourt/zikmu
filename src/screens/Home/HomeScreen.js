import React, {Component} from 'react';
import {
	Dimensions,
	Image,
	Pressable,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
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
				user: {
					name: 'Vald',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			},
			{
				id: 2,

				user: {
					name: 'Sch',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/1.jpg'
			},
			{
				id: 3,

				user: {
					name: 'Capri',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/2.jpg'
			},
			{
				id: 4,

				user: {
					name: 'Bu$hi',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/3.jpg'
			},
			{
				id: 5,

				user: {
					name: 'Fianso',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/5.jpg'
			},
			{
				id: 6,

				user: {
					name: 'ZKR',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/6.jpg'
			},
			{
				id: 7,

				user: {
					name: 'Vald',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/7.jpg',
				video: 'https://www.youtube.com/embed/xPbRsca_l7c'
			},
			{
				id: 11,

				user: {
					name: 'Damso',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg'
			},
			{
				id: 12,

				user: {
					name: 'Seezy',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/1.jpg'
			},
			{
				id: 13,

				user: {
					name: 'Kalash Criminel',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/2.jpg'
			},
			{
				id: 14,

				user: {
					name: 'Freeze Corleone',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/3.jpg'
			},
			{
				id: 15,

				user: {
					name: 'Kaaris',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/5.jpg'
			},
			{
				id: 16,

				user: {
					name: 'Ninho',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/6.jpg'
			},
			{
				id: 17,

				user: {
					name: 'Rim\'k',
					picture: 'https://picsum.photos/48',
				},
				picture: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/7.jpg',
				video: 'https://www.youtube.com/embed/xPbRsca_l7c'
			}
		];

		return (
			<LinearGradient
				colors={['#B00D72', '#5523BF']}
				style={{
					marginTop: 0,
					...styles.container,
				}}>
				<View style={{}}>
					<ScrollView style={{ paddingTop: StatusBar.currentHeight + 10, paddingBottom: 10}} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll={true}>
						<ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{flex: 1, backgroundColor: "#B00D72", paddingVertical: 10, elevation: 10, borderRadius: 10, marginHorizontal: 10}}>
							{stories.map((story, key) => (
								<Pressable onPress={() => this.props.navigation.navigate('Story', {
									story: story
								})} style={{position: 'relative'}}>
									<SharedElement id={story.id}>
										<View style={{...styles.stories.imageContainer}}>
											<Image source={{uri: story.picture}} style={styles.stories.image}/>
										</View>
									</SharedElement>
									<Pressable onPress={() => {
										//fetch artist_id from database ticket #FLEX-38
										// this.props.navigation.push('Artist', {});
									}} style={{flex: 1, flexDirection: 'row', justifyContent: 'center', maxWidth: "99%"}}>
										<Text style={{textAlign: 'center', marginTop: 5, color: 'white'}} numberOfLines={1}>{story.user.name}</Text>
									</Pressable>
								</Pressable>
							))}
						</ScrollView>
					<View style={{flex: 1, paddingVertical: 20, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
						<Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this._display_message()}</Text>
						<View style={{flexDirection: 'row'}}>
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

				</View>
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
			borderRadius: 10
		},
		imageContainer: {
			borderRadius: 10,
			width: 64,
			height: 64 * 1.77,
			elevation: 10,
			marginHorizontal: 10,
			borderColor: 'white',
			borderWidth: 2,
		}
	}
});

export default connect(mapStateToProps)(HomeScreen);
