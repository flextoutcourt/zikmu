import React, {Component} from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {connect} from 'react-redux';

import authHandler from '../../utils/authenticationHandler';

import {setAccessToken, setRefreshToken, setSigingIn,} from '../../redux/features/authentication/authenticationSlice';
import {SafeAreaView} from 'react-native-safe-area-context';

import axios from 'axios';
import Button from '../../components/Home/Guest/Button';

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: null,
			password: null,
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
					colors={['#B00D72', '#5523BF']}
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
						<Text style={styles.title}>Se connecter</Text>
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
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate('ResetPassword')}>
							<Text style={{textDecorationLine: 'underline'}}>
								Mot de passe oublié
							</Text>
						</TouchableOpacity>
						<View
							style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
							<Button
								onPress={() => {
									this.onPressLogin();
								}}
								title={'Me connecter'}
								color={'#B00D70'}
							/>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							padding: 10,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Text style={{marginBottom: 15}}>Je n'ai pas encore de compte</Text>
						<Button
							onPress={() => {
								this.props.navigation.navigate('Register');
							}}
							title={"M'inscrire"}
							color={'#B00D70'}
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

var styles = StyleSheet.create({
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
