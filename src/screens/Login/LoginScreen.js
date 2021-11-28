import React, {Component} from 'react';
import {Text, View, Dimensions, TextInput, StyleSheet, TouchableOpacity} from 'react-native';


import {connect} from 'react-redux';

import authHandler from '../../utils/authenticationHandler';

import { setAccessToken, setRefreshToken, setSigingIn } from '../../redux/features/authentication/authenticationSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

import axios from 'axios';

class LoginScreen extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      email: null,
      password: null
    };
  }


  
  onPressLogin = async () => {
    const authenticationObject = await authHandler.onLogin();
    this.props.setAccessToken({accessToken: authenticationObject.accessToken});
    this.props.setRefreshToken({
      refreshToken: authenticationObject.refreshToken,
    });
  };

  _handleTextChange = (e) => {
    this.setState({username: e});
  }

  _handlePasswordChange = (e) => {
    console.log(e);
    this.setState({password: e});
  }

  _login = (e) => {
    axios.post('http://dev.quentinleclerc.fr/api/zikmu/login')
      .then(data => {
        console.log(data.data)
      });
  }

  _register = (e) => {
    axios.post('http://dev.quentinleclerc.fr/api/zikmu/register')
      .then(data => {
        console.log(data.data)
      });
  }

  _reset_password = (e) => {
    axios.post('http://dev.quentinleclerc.fr/api/zikmu/reset_password')
      .then(data => {
        console.log(data.data);
      })
  }

  //login with google, facebook


  render() {
    return (
      <SafeAreaView style={styles.main}>
        <View style={styles.container}>
          <View style={{flex: 1, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.title}>Se connecter</Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center', width: Dimensions.get('screen').width - 50}}>
            <Text style={{textAlign: 'left', color: 'white'}}>Votre email</Text>
            <TextInput onChangeText={this._handleTextChange} placeholder={"Username"} value={this.state.username} style={styles.input} placeholderTextColor={'rgba(0,0,0,0.7)'}  />
            <Text style={{textAlign: 'left', color: 'white'}}>Votre mot de passe</Text>
            <TextInput onChangeText={this._handlePasswordChange} placeholder={"Password"} value={this.state.password} secureTextEntry={true} style={styles.input} placeholderTextColor={'rgba(0,0,0,0.7)'} />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ResetPassword')}>
              <Text>Mot de passe oublié</Text>
            </TouchableOpacity>
            <View style={{flex: 1, width: Dimensions.get('screen').width, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity onPress={this.onPressLogin} style={styles.button}>
                <Text style={{color: 'white', textAlign: 'center'}}>Appuyez pour vous connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center', width: Dimensions.get('screen').width - 50}}>
            <Text>Je n'ai pas encore de compte</Text> 
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Register')
              }} style={styles.button}
            >
              <Text>M'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
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

var styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: 'center',
    width: Dimensions.get('screen').width - 50, 
    color: "white"
  },
  container:{
    width: Dimensions.get('screen').width - 50,
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
    width: Dimensions.get('screen').width -50,
    backgroundColor: "white",
    color: "black",
    marginVertical: 10,
    borderRadius: 10
  },
  button:{
    padding: 10,
    backgroundColor: "red",
    borderRadius: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
