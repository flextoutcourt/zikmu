//import liraries
import React, { Component , useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {connect, ReactReduxContext} from 'react-redux';

import Playlists from './Library/Playlists';
import Albums from './Library/Albums';
import Artists from './Library/Artists';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {useNavigation} from '@react-navigation/native';

const Library = () => {

    const navigation = useNavigation();

    const {store} = useContext(ReactReduxContext);

    const Tab = createMaterialTopTabNavigator();

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
            <Tab.Navigator>
                <Tab.Screen name="Playlists" component={Playlists}></Tab.Screen>
                <Tab.Screen name="Albums" component={Albums}></Tab.Screen>
                <Tab.Screen name="Artists" component={Artists}></Tab.Screen>
            </Tab.Navigator>
        </View>
    );
};

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(Library);
