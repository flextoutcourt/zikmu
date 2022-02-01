import * as React from 'react';
import {Dimensions, StatusBar, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import LoginScreen from '../screens/Login/LoginScreen';
import GuestScreen from '../screens/Home/GuestScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import Footer from '../components/Home/Guest/Footer';

const Stack = createNativeStackNavigator();

export default function GuestNavigation() {
	const Test = () => {
		return (
			<View style={{flex: 1}}>
				<LinearGradient
					colors={['#B00D72', '#5523BF']}
					start={{x: 1, y: 0}}
					end={{x: 0, y: 1}}
					style={{
						flex: 1,
						width: Dimensions.get('screen').width,
						paddingTop: StatusBar.currentHeight * 2,
					}}>
					<Text>Reset password</Text>
				</LinearGradient>
			</View>
		);
	};

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Guest"
					component={GuestScreen}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					options={{
						headerShown: true,
						headerTransparent: true,
						headerTintColor: 'white',
						headerShadowVisible: false,
						title: 'Connexion',
					}}
				/>
				<Stack.Screen
					name="Register"
					component={RegisterScreen}
					options={{
						headerShown: true,
						headerTransparent: true,
						headerTintColor: 'white',
						headerShadowVisible: false,
						title: 'Inscription',
					}}
				/>
				<Stack.Screen
					name="ResetPassword"
					component={Test}
					options={{
						headerShown: true,
						headerTransparent: true,
						headerTintColor: 'white',
						headerShadowVisible: false,
						title: 'Réinitialisation du mot de passe',
					}}
				/>
				<Stack.Screen
					name="MTS"
					component={Test}
					options={{
						headerShown: true,
						headerTransparent: true,
						headerTintColor: 'white',
						headerShadowVisible: false,
						title: 'Mentions légales',
					}}
				/>
				<Stack.Screen
					name="CGV"
					component={Test}
					options={{
						headerShown: true,
						headerTransparent: true,
						headerTintColor: 'white',
						headerShadowVisible: false,
						title: 'Conditions Générales de vente',
					}}
				/>
				<Stack.Screen
					name="Contact"
					component={Test}
					options={{
						headerShown: true,
						headerTransparent: true,
						headerTintColor: 'white',
						headerShadowVisible: false,
						title: 'Nous contacter',
					}}
				/>
			</Stack.Navigator>
			<Footer/>
		</NavigationContainer>
	);
}
