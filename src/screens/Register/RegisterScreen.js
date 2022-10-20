import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';

import {connect} from 'react-redux';

import authHandler from '../../utils/authenticationHandler';

import {
  setAccessToken,
  setRefreshToken,
  setSigingIn,
} from '../../redux/features/authentication/authenticationSlice';
import {SafeAreaView} from 'react-native-safe-area-context';

import axios from 'axios';
import Button from '../../components/Home/Guest/Button';

class RegisterScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      checkboxNotify: false,
      checkboxCGV: false,
    };
  }

  onPressLogin = async () => {
    const authenticationObject = await authHandler.onLogin();
    this.props.setAccessToken({accessToken: authenticationObject.accessToken});
    this.props.setRefreshToken({
      refreshToken: authenticationObject.refreshToken,
    });
  };

  _handleTextChange = e => {
    this.setState({username: e});
  };

  _handlePasswordChange = e => {
    console.log(e);
    this.setState({password: e});
  };

  _login = e => {
    axios.post('http://dev.quentinleclerc.fr/api/zikmu/login').then(data => {
      console.log(data.data);
    });
  };

  _register = e => {
    axios.post('http://dev.quentinleclerc.fr/api/zikmu/register').then(data => {
      console.log(data.data);
    });
  };

  _reset_password = e => {
    axios
      .post('http://dev.quentinleclerc.fr/api/zikmu/reset_password')
      .then(data => {
        console.log(data.data);
      });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, marginTop: -StatusBar.currentHeight}}>
        <LinearGradient
          colors={['#15202B', '#15202B']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          style={{flex: 1, width: Dimensions.get('screen').width}}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.title}>Créer un compte</Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Text style={{textAlign: 'left', color: 'white'}}>
                Votre email
              </Text>
              <TextInput
                onChangeText={this._handleTextChange}
                placeholder={'mail@example.fr'}
                value={this.state.username}
                style={styles.input}
                placeholderTextColor={'rgba(0,0,0,0.7)'}
              />
            </View>
            <View>
              <Text style={{textAlign: 'left', color: 'white'}}>
                Votre mot de passe
              </Text>
              <TextInput
                onChangeText={this._handlePasswordChange}
                placeholder={'mot de passe'}
                value={this.state.password}
                secureTextEntry={true}
                style={styles.input}
                placeholderTextColor={'rgba(0,0,0,0.7)'}
              />
            </View>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#7856FF', false: '#473B95'}}
                  value={this.state.checkboxNotify}
                  onValueChange={() =>
                    this.setState({checkboxNotify: !this.state.checkboxNotify})
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({checkboxNotify: !this.state.checkboxNotify});
                  }}>
                  <Text
                    style={{
                      color: this.state.checkboxNotify ? '#7856ff' : 'white',
                    }}>
                    Me notifier
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#7856FF', false: '#473B95'}}
                  value={this.state.checkboxCGV}
                  onValueChange={() =>
                    this.setState({checkboxCGV: !this.state.checkboxCGV})
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({checkboxCGV: !this.state.checkboxCGV});
                  }}>
                  <Text
                    style={{
                      color: this.state.checkboxCGV ? '#7856ff' : 'white',
                    }}>
                    Accepter les CGV
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{marginBottom: 15, color: 'white'}}>
              J'ai déjà un compte
            </Text>
            <Button
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}
              title={'Me connecter'}
              color={'#7856ff'}
            />
          </View>
        </LinearGradient>
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

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: 'center',
    width: Dimensions.get('screen').width,
    color: 'white',
  },
  container: {
    width: Dimensions.get('screen').width,
    marginHorizontal: 25,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  main: {
    backgroundColor: 'black',
    flex: 1,
  },
  input: {
    width: Dimensions.get('screen').width - 20,
    backgroundColor: 'white',
    color: 'black',
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
