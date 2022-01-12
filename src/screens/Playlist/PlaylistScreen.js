import axios from 'axios';
import React from 'react';
import { Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Animated, {interpolate, Extrapolate, useAnimatedScrollHandler} from 'react-native-reanimated';
import { connect } from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';



class PlaylistScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playlist: null,
            scrollY: new Animated.Value(0),
        }
    }
    
    _get_playlist = () => {
        const promise = axios.get('https://api.spotify.com/v1/playlists/' + this.props.route.params.playlist_id , {
            headers: {
                Accept: "application/json",
				Authorization: "Bearer " + this.props.store.authentication.accessToken,
				"Content-Type": "application/json"
			}
        });
        const response = promise.then(data => data.data);
        return response
    }

    headerTitle = () => {
        const opacity = this.state.scrollY.interpolate({
            inputRange: [250, 325], 
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP
        })
        const background = this.state.scrollY.interpolate({
            inputRange: [250,325],
            outputRange: [0, 0.5],
            extrapolate: Extrapolate.CLAMP
        })
        return (
            <Animated.View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', opacity: opacity, backgroundColor: `rgba(0,0,0,${background})`}}>
                {this.state.playlist?.images[0]
                    ?
                        <Image source={{uri: this.state.playlist?.images[0]?.url}} style={{height: 40, width: 40, borderRadius: 10}} />
                    :
                        null
                }
                <Text style={{color: 'white', marginLeft: 10, fontWeight: 'bold'}} >{this.state.playlist?.name}</Text>
            </Animated.View>
        )
    }
    
    componentDidMount(){
        const opacity = this.state.scrollY.interpolate({
            inputRange: [250, 325],
            outputRange: [0, 0.5],
            extrapolate: Extrapolate.CLAMP
        });
        this._get_playlist().then(json => {
            this.setState({playlist: json});
            this.props.navigation.setOptions({
                headerTitle: () => this.headerTitle(),
                headerStyle: {
                    backgroundColor: `rgba(0,0,0,${opacity})`,
                },
                headerTintColor: 'white',
                headerRight: () => (
                    <FontAwesome5Icon name='heart' size={24} solid={true} color={"white"} />
                )
            });
        })
    }

    handleScroll = (scrollY) => {
        // alert('called');
        console.log(scrollY.nativeEvent.contentOffset.y);
        if(scrollY > 275){
            this.props.navigation.setOptions({
                headerTitle: () => this.headerTitle(),
                headerStyle: {
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }
            })
        }else{
            this.props.navigation.setOptions({
                headerTitle: () => <></>,
                headerStyle: {
                    backgroundColor: 'rgba(0,0,0,0)'
                }
            })
        }
        return scrollY;
    }

    

    render(){
        const scale = this.state.scrollY.interpolate({
            inputRange: [-Dimensions.get('screen').height, 325],
            outputRange: [3, 0.1],
            extrapolateRight: Extrapolate.CLAMP
        });
        const opacity = this.state.scrollY.interpolate({
            inputRange: [0, 325], 
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });
        const mt = this.state.scrollY.interpolate({
            inputRange: [0, 325],
            outputRange: [10, -100],
            extrapolate: Extrapolate.CLAMP
        })
        const br = this.state.scrollY.interpolate({
            inputRange: [-10, 10], 
            outputRange: [0, 10],
            extrapolate: Extrapolate.CLAMP
        });
        const transform = [{scale}];
        return (
            <LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: -StatusBar.currentHeight,  ...styles.container, paddingTop: StatusBar.currentHeight}}>
                <Animated.ScrollView 
                    onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY }}}],
                            { listener: '', useNativeDriver: true },
                        )
                    }
                    scrollEventThrottle={16}
                >
                {
                    this.state.playlist
                    ?
                        <FlatList
                            data={this.state.playlist?.tracks?.items}
                            scrollEnabled={false}
                            horizontal={false}
                            ListHeaderComponent={() => (
                                <Animated.View style={{marginTop: 2 * StatusBar.currentHeight}}>
                                    <Animated.View style={{alignItems: 'flex-start', justifyContent: 'flex-start', elevation: 10, margin: 10, marginBottom: mt, transform: transform, width: Dimensions.get('screen').width -20, height: Dimensions.get('screen').width - 20, position: "relative", opacity: opacity}}>
                                        <Animated.Image source={{uri: this.state.playlist?.images[0]?.url}} style={{width: '100%', height: '100%', borderRadius: br}} />
                                        <Animated.Text style={{position: 'absolute', top: 5, left: 10, backgroundColor: 'red', borderRadius: 9, padding: 5, elevation: 10, opacity: opacity}}>
                                            {this.state.playlist?.followers?.total}
                                        </Animated.Text>
                                    </Animated.View>
                                    <Animated.View style={{opacity: opacity,}}>
                                        <Text style={{textAlign: 'center', fontSize: 28, color: 'white'}}>{this.state.playlist?.name}</Text>
                                    </Animated.View>
                                </Animated.View>
                            )}
                            renderItem={({item, key, index}) => (
                                <TouchableOpacity onPress={() => navigation.navigate('Playlist', {
                                    playlist_id: item.track.id
                                })}>
                                    <TrackItem track={item?.track} album={item?.track?.album} type={"playlist"} playlist_uri={this.state.playlist?.uri} playlist_index={index} />
                                </TouchableOpacity>
                            )}
                        />
                    :
                        null
                }
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
});


const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(PlaylistScreen);