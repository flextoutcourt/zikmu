//import liraries
import axios from 'axios';
import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import PlaylistItem from '../../../components/Playlist/PlaylistItem';

// create a component
class Playlists extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            playlists: null
        }
    }
    
    _get_playlists = (offset = 0) => {
        const promise = axios.get(`https://api.spotify.com/v1/me/playlists?offset=${offset}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.store.authentication.accessToken,
                "Content-Type": "application/json"
            },
        });
        const response = promise.then(data => data.data);
        return response;
    }

    componentDidMount(){
        this._get_playlists().then(data => this.setState({playlists: data.items}));
    }

    render(){
        return (
            <LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: -StatusBar.currentHeight}, styles.container}>
                <FlatList
                    ListHeaderComponent={() => (
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('MyTracks');
                        }}>
                            <Text>Mes titres likés</Text> 
                        </TouchableOpacity>
                    )}
                    data={this.state.playlists}
                    scrollEnabled={true}
                    horizontal={false}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this._get_playlists(this.state.playlists.length - 1).then(data => {
                            this.setState({playlists: [...this.state.playlists, ...data.items]});
                        });
                    }}
                    renderItem={({item, key}) => (
                        <PlaylistItem playlist={item} />
                    )}
                />
            </LinearGradient>
        );
    }
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50'
    },
});

const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(Playlists)
