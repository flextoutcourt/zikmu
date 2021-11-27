import React, {useState, useEffect, useContext} from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {ReactReduxContext, connect} from 'react-redux';

import axios from 'axios';
import Store from './../../redux/store/index';

import RecentComponent from './../../components/Home/RecentComponent';
import GenreComponent from '../../components/Home/GenreComponent';

function HomeScreen() {

    const {store} = useContext(ReactReduxContext);

    const [genres, setGenres] = useState([]);

    const navigation = useNavigation();

    return (
<<<<<<< HEAD
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
=======
        <SafeAreaView style={{flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: Dimensions.get('screen').width, backgroundColor: 'black'}}>
>>>>>>> 68e33f4cb4a8db0bf2fb2291564b05c72ba6e63d
            <RecentComponent />
            <GenreComponent />
        </SafeAreaView>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(HomeScreen);
