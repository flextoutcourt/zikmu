import React, {useState, useEffect, useContext} from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
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
        <View style={{flex: 1, backgroundColor: 'black'}}>
        <RecentComponent />
        <GenreComponent />
        </View>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(HomeScreen);
