import axios from 'axios';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import Albums from '../../components/Artist/Albums';
import RelatedArtists from '../../components/Artist/RelatedArtists';
import TopTracks from '../../components/Artist/TopTracks';

class ArtistScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            artist: null
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
        return (
            <LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: -StatusBar.currentHeight}, styles.container}>
                <ScrollView style={{flex: 1, width: Dimensions.get('screen').width}}>
                    {
                        this.state.artist != null
                        ?
                            <>
                                <View style={{alignItems: 'center', marginTop: 10}} >
                                    <Image source={{uri: this.state.artist?.images[0]?.url}} style={{width: Dimensions.get('screen').width - 150, height: Dimensions.get('screen').width - 150, borderRadius: this.state.artist?.images[0].height}} />
                                </View>
                                <Text style={{fontSize: 36, color: 'white', textAlign: 'center', marginTop: 10}}>{this.state.artist?.name}</Text>
                                <TopTracks artist={this.state.artist} />
                                <Albums artist={this.state.artist} />
                                <RelatedArtists artist={this.state.artist} />
                            </>
                        :
                            <Text>test</Text>
                    }
                </ScrollView>
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
