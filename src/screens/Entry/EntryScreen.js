import React, {Component} from 'react';
import {StatusBar,} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

//Authentication handler
import authHandler from '../../utils/authenticationHandler';
import listeningHandler from '../../utils/listeningHandler';

import PlayerAlt from '../../components/Global/PlayerAlt';

//Redux imports
import {connect} from 'react-redux';
import {
  setAccessToken,
  setLoadingFalse,
  setLoadingTrue,
  setRefreshToken,
} from '../../redux/features/authentication/authenticationSlice';

//Navigations
import LoggedinNavigation from '../../navigation/loggedInNavigation';
import GuestNavigation from '../../navigation/guestNavigation';

class EntryScreen extends Component {
	state = {refreshToken: ''};

	componentDidUpdate(prevProps) {
		if (
			this.props.refreshToken !== prevProps.refreshToken &&
			!this.props.accessToken
		) {
			this.tryAutoLogin();
		}
		if (this.props.accessToken !== prevProps.accessToken) {
			this.props.setLoadingFalse();
		}
	}

	tryAutoLogin = async () => {
		this.props.setLoadingTrue();
		const authenticationObject = await authHandler.refreshLogin(
			this.props.refreshToken,
		);

		this.props.setAccessToken({
			accessToken: authenticationObject.accessToken,
		});
		this.props.setRefreshToken({
			refreshToken: authenticationObject.refreshToken,
		});

		this.props.setLoadingFalse();
	};

	render() {
		const {accessToken, loading} = this.props.authentication;

		// if (loading) {
		//   return (
		//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		//       <Text>Chargement de l'application en cours</Text>
		//     </View>
		//   )
		// }

		if (accessToken) {
			return (
				<SafeAreaProvider>
					<SafeAreaView style={{flex: 1, paddingTop: -StatusBar.currentHeight}}>
						<StatusBar
							backgroundColor={'rgba(0,0,0, 0.5)'}
							translucent={true}
						/>
						<LoggedinNavigation/>
					</SafeAreaView>
				</SafeAreaProvider>
			);
		}

		return (
			<SafeAreaProvider>
				<SafeAreaView style={{flex: 1, marginTop: -StatusBar.currentHeight}}>
					<StatusBar backgroundColor={'rgba(0,0,0, 0.5)'} translucent={true}/>
					<GuestNavigation/>
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}
}

const mapStateToProps = state => {
	return {
		authentication: state.authentication,
		accessToken: state.authentication.accessToken,
		refreshToken: state.authentication.refreshToken,
		listening: state.listening.listening
	};
};

const mapDispatchToProps = {
	setAccessToken,
	setRefreshToken,
	setLoadingTrue,
	setLoadingFalse,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryScreen);
