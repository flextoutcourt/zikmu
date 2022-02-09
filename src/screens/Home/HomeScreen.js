import React, {Component} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import RecentComponent from '../../components/Home/Recents/RecentComponent';
import GenreComponent from '../../components/Home/Genres/GenreComponent';
import ReleaseComponent from '../../components/Home/Release/ReleaseComponent';
import FollowComponent from '../../components/Home/Follows/FollowComponent';

class HomeScreen extends Component {
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
		return (
			<LinearGradient
				colors={['#B00D72', '#5523BF']}
				style={{
					marginTop: 0,
					...styles.container,
				}}>
				<ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, paddingBottom: 155}}>
					<View style={{flex: 1, paddingVertical: 20, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
						<Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this._display_message()}</Text>
						<View style={{flexDirection: 'row'}}>
							{/*<TouchableOpacity onPress={() => alert('settings')} style={{marginLeft: 20}}>*/}
							{/*	<FontAwesome5Icon name={'cogs'} solid={true} size={24} color={'white'} />*/}
							{/*</TouchableOpacity>*/}
							<TouchableOpacity onPress={() => this.props.navigation.push('Self')} style={{marginLeft: 20}}>
								<FontAwesome5Icon name={'cogs'} solid={true} size={24} color={'white'} />
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
});

export default connect(mapStateToProps)(HomeScreen);
