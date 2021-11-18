import React, {useState, useEffect, useContext} from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import {useNavigation} from '@react-navigation/native';

import {ReactReduxContext, connect} from 'react-redux';

import axios from 'axios';
import Store from './../../redux/store/index';

import RecentComponent from './../../components/RecentComponent';
import GenreComponent from './../../components/GenreComponent';

function HomeScreen() {

    const {store} = useContext(ReactReduxContext);

    const [genres, setGenres] = useState([]);

    const navigation = useNavigation();

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'}}>
        <RecentComponent />
        <GenreComponent />
        </View>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(HomeScreen);
