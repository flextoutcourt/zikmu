import React from 'react';
import {FlatList, StatusBar, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Genres/Header';
import axios from 'axios';
import PlaylistForGenre from '../../../components/Genres/Playlist';

class NewsScreen extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            news: null,
            scrollY: new Animated.Value(0),
        };
    }

    _get_playlists = (offset = 0, limit = 50) => {
        const promise = axios.get(
            `https://api.spotify.com/v1/browse/categories/${this.props.route.params.genre.id}/playlists?limit=${limit}&offset=${offset}`,
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
        this._get_playlists().then(json => this.setState({playlists: json.playlists?.items}));
    }

    render() {
        return (
            <LinearGradient
                colors={['#15202B', '#15202B']}
                style={{
                    marginTop: -StatusBar.currentHeight,
                    ...styles.container,
                    paddingTop: StatusBar.currentHeight,
                }}
            >
                <Header
                    y={this.state.scrollY}
                    genre={this.props.route.params.genre}
                    {...this.props}
                />
                <Animated.ScrollView
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                        {listener: '', useNativeDriver: true},
                    )}
                    style={{marginTop: -2.5 * StatusBar.currentHeight}}
                    scrollEventThrottle={16}>
                    <View style={{marginTop: 2.5 * StatusBar.currentHeight, paddingBottom: 120}}>
                        <FlatList
                            numColumns={2}
                            data={this.state.playlists}
                            renderItem={({item, key}) => (
                                <PlaylistForGenre playlist={item}/>
                            )}
                            onEndReached={() => {
                                this._get_playlists(this.state.playlists.length).then(json => this.setState({playlists: [...this.state.playlists, ...json.playlists.items]}));
                            }}
                        />
                    </View>
                </Animated.ScrollView>
            </LinearGradient>
        );
    }

}

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

export default connect(mapStateToProps)(NewsScreen);
