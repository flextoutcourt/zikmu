//import liraries
import axios from 'axios';
import React from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import PlaylistItem from '../../../components/Playlist/PlaylistItem';

const {width} = Dimensions.get('screen');

// create a component
class Playlists extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playlists: null,
        };
    }

    _get_playlists = (offset = 0) => {
        const promise = axios.get(
            `https://api.spotify.com/v1/me/playlists?offset=${offset}`,
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
    };

    componentDidMount() {
        this._get_playlists().then(data => this.setState({playlists: data.items}));
    }

    render() {
        return (
            <LinearGradient
                colors={['#15202B', '#15202B']}
                style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
                <FlatList
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    ListHeaderComponent={() => (
                        <LinearGradient colors={['#15202B', '#15202B', 'transparent']} style={{elevation: 10}}>
                            <TouchableOpacity onPress={() => alert('test')}>
                                <LinearGradient colors={['#391a6c', '#b21f1f']} useAngle={true} angle={180} style={{
                                    flex: 1,
                                    height: 50,
                                    width: width - 10,
                                    margin: 5,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Ajouter une
                                        playlist</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('MyTracks');
                            }}>
                                <LinearGradient colors={['#b21f1f', '#fdbb2d']} useAngle={true} angle={180} style={{
                                    flex: 1,
                                    height: 50,
                                    width: width - 10,
                                    margin: 5,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Mes titres
                                        likés ({this.props.store.liked?.liked?.total})</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    )}
                    data={this.state.playlists}
                    scrollEnabled={true}
                    horizontal={false}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this._get_playlists(this.state.playlists.length).then(data => {
                            this.setState({
                                playlists: [...this.state.playlists, ...data.items],
                            });
                        });
                    }}
                    renderItem={({item, key}) => <PlaylistItem playlist={item}/>}
                    contentContainerStyle={{paddingBottom: 120}}
                />
            </LinearGradient>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2732',
    },
});

const mapStateToProps = store => {
    return {
        store: store,
    };
};

export default connect(mapStateToProps)(Playlists);
