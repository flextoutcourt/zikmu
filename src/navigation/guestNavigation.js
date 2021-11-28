import * as React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from "../screens/Login/LoginScreen"
import GuestScreen from "../screens/Home/GuestScreen"
import RegisterScreen from '../screens/Register/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function GuestNavigation() {

  const Test = () => {
    return(
      <View>
        <Text>Reset password</Text>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Guest" component={GuestScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="ResetPassword" component={Test}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}