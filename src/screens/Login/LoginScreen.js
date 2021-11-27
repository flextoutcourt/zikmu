import React, {Component} from 'react';
import {View, Button, Dimensions} from 'react-native';

import {connect} from 'react-redux';

import authHandler from '../../utils/authenticationHandler';

import {
  setAccessToken,
  setRefreshToken,
  setSigingIn,
} from '../../redux/features/authentication/authenticationSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

class LoginScreen extends Component {
  state = {};

  onPressLogin = async () => {
    const authenticationObject = await authHandler.onLogin();
    this.props.setAccessToken({accessToken: authenticationObject.accessToken});
    this.props.setRefreshToken({
      refreshToken: authenticationObject.refreshToken,
    });
  };


  render() {
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: Dimensions.get('screen').width}}>
        <Button onPress={this.onPressLogin} title="Press to login" />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
  };
};

const mapDispatchToProps = {setAccessToken, setRefreshToken, setSigingIn};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);