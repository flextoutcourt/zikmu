import axios from 'axios';
import React from 'react';
import { Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';



class PlaylistScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playlist: null
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
    
    componentDidMount(){
        this._get_playlist().then(json => {
            this.setState({playlist: json});
            this.props.navigation.setOptions({
                headerTitle: () => (
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -15}}>
                        {json?.images[0]
                            ?
                                <Image source={{uri: json?.images[0]?.url}} style={{height: 48, width: 48, borderRadius: 10}} />
                            :
                                null
                        }
                        <Text style={{color: 'black', marginLeft: 10, fontWeight: 'bold'}}>{json?.name}</Text>
                    </View>
                ),
                headerRight: () => (
                    <FontAwesome5Icon name='heart' size={24} color={"red"} />
                )
            })
        })
    }

    render(){
        return (
            <LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: -StatusBar.currentHeight}, styles.container}>
                {
                    this.state.playlist
                    ?
                        <FlatList
                            data={this.state.playlist?.tracks?.items}
                            scrollEnabled={true}
                            horizontal={false}
                            ListHeaderComponent={() => (
                                <View style={{flex: 1, alignItems: 'center', marginTop: 15, position: 'relative'}}>
                                    <Image source={{uri: this.state.playlist?.images[0]?.url}} style={{width: Dimensions.get('screen').width -20, height: Dimensions.get('screen').width - 20, borderRadius: 10}} />
                                    <Text>{this.state.playlist?.name}</Text>
                                    <Text style={{position: 'absolute', top: 5, left: 10, backgroundColor: 'red', borderRadius: 9, padding: 5, elevation: 10}}>
                                        {this.state.playlist?.followers?.total}
                                    </Text>
                                </View>
                            )}
                            renderItem={({item, key}) => (
                                <TouchableOpacity onPress={() => navigation.navigate('Playlist', {
                                    playlist_id: item.track.id
                                })}>
                                    <TrackItem track={item?.track} album={item?.track?.album} />
                                </TouchableOpacity>
                            )}
                        />
                    :
                        null
                }
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