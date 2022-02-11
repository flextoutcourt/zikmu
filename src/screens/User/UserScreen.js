import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import {connect} from 'react-redux';
import Animated, {Extrapolate} from 'react-native-reanimated';
import SelfHeader from '../../components/User/SelfHeader';
import Header from '../../components/User/Header';
import axios from 'axios';

class UserScreen extends React.PureComponent{

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            backgroundColor: new Animated.color(0,0,0,1)
        }
    }

    _get_user = (user_id) => {
        let url = `https://api.spotify.com/v1/users/${user_id}`;
        const promise = axios.get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                'Content-Type': 'application/json',
            },
        });
        return promise.then(data => data.data);
    }

    componentDidMount(){
        this._get_user(this.props.route.params.user_id).then(json => this.setState({user: json}));
    }

    render(){
        const scale = this.state.scrollY.interpolate({
            inputRange: [-Dimensions.get('screen').height, 0, 125],
            outputRange: [2, 1, 0.5],
            extrapolateRight: Extrapolate.CLAMP,
        });
        const opacity = this.state.scrollY.interpolate({
            inputRange: [0, 200],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP,
        });
        const mb = this.state.scrollY.interpolate({
            inputRange: [0, 125],
            outputRange: [10, -75],
            extrapolate: Extrapolate.CLAMP,
        });

        const br = this.state.scrollY.interpolate({
            inputRange: [0, 10],
            outputRange: [0, 10],
            extrapolate: Extrapolate.CLAMP,
        });

        const height = this.state.scrollY.interpolate({
            inputRange: [0, 125],
            outputRange: [Dimensions.get('screen').width, Dimensions.get('screen').width],
            extrapolate: Extrapolate.CLAMP
        });

        const mt = this.state.scrollY.interpolate({
            inputRange: [0, Dimensions.get('window').height * 10],
            outputRange: [Dimensions.get('screen').width - 20, 0],
            extrapolate: Extrapolate.CLAMP
        });

        const borderRadius = this.state.scrollY.interpolate({
            inputRange: [0, 125],
            outputRange: [0, 350],
            extrapolate: Extrapolate.CLAMP
        });

        const transform = [{scale}];
        return(
            <LinearGradient
                colors={['#8e44ad', '#8e44ad']}
                style={{
                    marginTop: 0,
                    ...styles.container,
                }}>
                <Header {...this.props} user={this.state.user} y={this.state.scrollY} />
                <Animated.ScrollView style={{zIndex: 98}} onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                    {listener: '', useNativeDriver: true},
                )}>
                    <Animated.View style={{height: 1500, marginTop: mt, backgroundColor: '#8e44ad'}}>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                        <View style={{height: 50, margin: 50, width: Dimensions.get('screen').width - 100, backgroundColor: 'red'}}></View>
                    </Animated.View>
                {/*    Profil utilisateur*/}
                {/*    Differents settings */}
                </Animated.ScrollView>
            </LinearGradient>
        )
    }

}

const mapStateToProps = store => {
    return {
        store: store
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default connect(mapStateToProps)(UserScreen);
