import React, {Component} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import Animated, {Extrapolate} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Genres/Header';

class PopularScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            playlists: null,
            scrollY: new Animated.Value(0)
        }
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

export default connect(mapStateToProps)(PopularScreen);
