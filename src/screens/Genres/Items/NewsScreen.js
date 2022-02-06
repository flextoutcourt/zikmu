import React, {Component} from 'react';
import {Text, View, StyleSheet, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import Animated, {Extrapolate} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Genres/Header';

class NewsScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            news: null,
            scrollY: new Animated.Value(0)
        }
    }

    _get_playlists = (offset = 0) => {
        const promise = axios.get(
            `https://api.spotify.com/v1/browse/categories/${this.props.route.params.genre_id}/playlists?limit=4&offset=${offset}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization:
                        'Bearer ' + this.props.store.authentication.accessToken,
                    'Content-Type': 'application/json',
                },
            },
        );
        return promise.then(data => data.data);
    }

    componentDidMount(){

    }

    render(){
        return(
            <LinearGradient
                colors={['#B00D72', '#5523BF']}
                style={{
                    marginTop: -StatusBar.currentHeight,
                    ...styles.container,
                    paddingTop: StatusBar.currentHeight,
                }}
            >
                <Header
                    y={this.state.scrollY}
                    genre={this.state.genre}
                    {...this.props}
                />
                <Animated.ScrollView
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                        {listener: '', useNativeDriver: true},
                    )}
                    style={{marginTop: -2.5 * StatusBar.currentHeight}}
                    scrollEventThrottle={16}>
                </Animated.ScrollView>
            </LinearGradient>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
})

const mapStateToProps = store => {
    return{
        store: store
    }
}

export default connect(mapStateToProps)(NewsScreen);
