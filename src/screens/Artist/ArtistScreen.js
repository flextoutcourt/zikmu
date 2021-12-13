import axios from 'axios';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {interpolate, Extrapolate} from 'react-native-reanimated';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import Albums from '../../components/Artist/Albums';
import Header from '../../components/Artist/Header';
import RelatedArtists from '../../components/Artist/RelatedArtists';
import TopTracks from '../../components/Artist/TopTracks';

class ArtistScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            artist: null,
            scrollY: new Animated.Value(0)
        }
    }
    _get_artist = () => {
        const promise = axios.get(`https://api.spotify.com/v1/artists/${this.props.route.params.artist_id}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.store.authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
        const response = promise.then(data => data.data);
        return response;
    }

    componentDidMount(){
        this._get_artist().then(data => {
            this.setState({artist: data});
            this.props.navigation.setOptions({
                headerTitle: () => (
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -15}}>
                        {data?.images[0]
                            ?
                                <Image source={{uri: data?.images[0]?.url}} style={{height: 48, width: 48, borderRadius: 10}} />
                            :
                                null
                        }
                        <Text style={{color: 'black', marginLeft: 10, fontWeight: 'bold'}}>{data?.name}</Text>
                    </View>
                ),
                headerRight: () => (
                    <FontAwesome5Icon name='heart' size={24} color={"red"} />
                )
            })
        });
    }

    render(){

        const borderRadius = this.state.scrollY.interpolate({
            inputRange: [0, 325],
            outputRange: [0, this.state.artist?.images[2]?.height],
            extrapolate: Extrapolate.CLAMP
        })

        const height = this.state.scrollY.interpolate({
            inputRange: [-150, 0, 250],
            outputRange: [this.state.artist?.images[0]?.height, this.state.artist?.images[1].height, 50],
            extrapolate: Extrapolate.CLAMP
        })

        return (
            <LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: -StatusBar.currentHeight}, styles.container}>
                <Header y={this.state.scrollY} artist={this.state.artist} {...this.props} />
                <Animated.ScrollView
                 style={{flex: 1, width: Dimensions.get('screen').width, marginTop: - 2 * StatusBar.currentHeight}}
                 onScroll={Animated.event(
                     [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                     {listener: '', useNativeDriver: true}
                 )}
                 >
                    {
                        this.state.artist != null
                        ?
                            <>
                                <Animated.View style={{alignItems: 'center', marginTop: 2*StatusBar.currentHeight}} >
                                    <Animated.Image source={{uri: this.state.artist?.images[0]?.url}} style={{width: height, height: height, borderRadius: borderRadius}} />
                                </Animated.View>
                                <Text style={{fontSize: 36, color: 'white', textAlign: 'center', marginTop: 10}}>{this.state.artist?.name}</Text>
                                <TopTracks artist={this.state.artist} />
                                <Albums artist={this.state.artist} />
                                <RelatedArtists artist={this.state.artist} />
                            </>
                        :
                            <Text>test</Text>
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


export default connect(mapStateToProps)(ArtistScreen);
