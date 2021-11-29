import React, {Component} from 'react';
import {Text} from 'react-native';

//Authentication handler
import authHandler from '../../utils/authenticationHandler';

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
    if (this.props.refreshToken !== prevProps.refreshToken && !this.props.accessToken) {
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

    if (loading) {
      return <Text>Loading</Text>;
    }

    if (accessToken) {
      return <LoggedinNavigation />;
    }

    return <GuestNavigation />;
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
    accessToken: state.authentication.accessToken,
    refreshToken: state.authentication.refreshToken
  };
};

const mapDispatchToProps = {
  setAccessToken,
  setRefreshToken,
  setLoadingTrue,
  setLoadingFalse,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EntryScreen);