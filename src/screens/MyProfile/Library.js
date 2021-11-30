//import liraries
import React, { Component , useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {connect, ReactReduxContext} from 'react-redux';

import Playlists from './Library/Playlists';
import Albums from './Library/Albums';
import Artists from './Library/Artists';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {useNavigation} from '@react-navigation/native';
import Tracks from './Library/Tracks';
import { SafeAreaView } from 'react-native-safe-area-context';

const Library = () => {

    const navigation = useNavigation();

    const {store} = useContext(ReactReduxContext);

    const Tab = createMaterialTopTabNavigator();

    return (
        <SafeAreaView style={{flex: 1}}>
            <Tab.Navigator>
                <Tab.Screen name="Playlists" component={Playlists} />
                <Tab.Screen name="Albums" component={Albums} />
                <Tab.Screen name="Artists" component={Artists} />
            </Tab.Navigator>
        </SafeAreaView>
    );
};

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(Library);
