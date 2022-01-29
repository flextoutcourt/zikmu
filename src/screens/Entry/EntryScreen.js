import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/FontAwesome5';

//Authentication handler
import authHandler from '../../utils/authenticationHandler';

import PlayerAlt from '../../components/Global/PlayerAlt';

//Redux imports
import {connect} from 'react-redux';
import {
  setAccessToken,
  setRefreshToken,
  setLoadingTrue,
  setLoadingFalse,
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
            <LoggedinNavigation />
            <PlayerAlt />
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }

    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1, marginTop: -StatusBar.currentHeight}}>
          <StatusBar backgroundColor={'rgba(0,0,0, 0.5)'} translucent={true} />
          <GuestNavigation />
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
  };
};

const mapDispatchToProps = {
  setAccessToken,
  setRefreshToken,
  setLoadingTrue,
  setLoadingFalse,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryScreen);
