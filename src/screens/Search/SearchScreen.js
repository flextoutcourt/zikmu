import axios from 'axios';
import React from 'react';
import {Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';
import AlbumItem from '../../components/Album/AlbumItem';
import GenreList from '../../components/Genres/GenreList';
import ArtistAlt from '../../components/Artist/ArtistAlt';

/** components */

class SearchScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            results: null,
            loading: false,
        };
    }

    /**
     * Perform a research
     * @param e
     * @private
     */
    _search = e => {
        // set variable search to to user request in order to control the text input
        this.setState({search: e});
        // set loading to display the activity indicator
        this.setState({loading: true});
        // reset results to null in order to display the genreComponent
        if (e === '') {
            this.setState({results: null});
        }
        // fetch data from spotify api using /search endpoint
        axios
            .get(
                `https://api.spotify.com/v1/search?q=${e}&limit=24&type=track,artist,album`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization:
                            'Bearer ' + this.props.store.authentication.accessToken,
                        'Content-Type': 'application/json',
                    },
                },
            )
            // store data into local state
            .then(data => this.setState({results: data.data}))
            // remove the activity indicator
            .finally(() => {
                this.setState({loading: false});
            });
    };

    _renderHeaderComponent = (label, type) => {
        return type?.items?.length > 0 ? (
            <View
                styles={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: 'red',
                    width: Dimensions.get('screen').width,
                }}>
                <Text style={{...styles.titles, marginLeft: 10}}>{label}</Text>
            </View>
        ) : null;
    };

    componentDidMount() {
    }

    render() {
        return (
            <LinearGradient
                colors={['#15202B', '#15202B']}
                style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
                <ScrollView
                    style={{
                        flex: 1,
                    }}
                    stickyHeaderIndices={[0]}>
                    <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}>
                        <View
                            style={{
                                paddingTop: 1.2 * StatusBar.currentHeight,
                                marginHorizontal: 0,
                                paddingHorizontal: 10,
                                marginBottom: 25,
                            }}>
                            <TextInput
                                onChangeText={this._search}
                                placeholder={'Rechercher'}
                                placeholderTextColor={'white'}
                                value={this.state.search}
                                style={{
                                    width: Dimensions.get('screen').width - 20,
                                    borderRadius: 10,
                                    backgroundColor: '#1E2732',
                                    padding: 10,
                                    elevation: 10,
                                    color: 'white',
                                }}
                            />
                        </View>
                    </LinearGradient>



                    {
                        this.state.results === null
                            ? <GenreList {...this.props} />
                            : null
                    }



                    <View>
                        <View>
                            {this._renderHeaderComponent(
                                'Artistes',
                                this.state.results?.artists,
                            )}
                            {!this.state.loading ? (
                                <FlatList
                                    numColumns={3}
                                    data={this.state.results?.artists?.items}
                                    scrollEnabled={false}
                                    renderItem={({item, key}) => (
                                        <ArtistAlt artist={item} {...this.props} />
                                    )}
                                />
                            ) : (
                                <Text>Chargement...</Text>
                            )}
                        </View>
                        <View>
                            {this._renderHeaderComponent(
                                'Titres',
                                this.state.results?.tracks,
                            )}
                            {!this.state.loading ? (
                                <FlatList
                                    data={this.state.results?.tracks?.items}
                                    scrollEnabled={false}
                                    horizontal={false}
                                    listHeaderComponent={this._renderHeaderComponent(
                                        'Titres',
                                        this.state.results?.tracks,
                                    )}
                                    renderItem={({item, key}) => (
                                        <TrackItem track={item} album={item.album}/>
                                    )}
                                />
                            ) : (
                                <Text>Loading</Text>
                            )}
                        </View>
                        <View style={{marginBottom: 110, paddingHorizontal: 10}}>
                            {this._renderHeaderComponent(
                                'Albums',
                                this.state.results?.albums,
                            )}
                            {!this.state.loading ? (
                                <FlatList
                                    numColumns={2}
                                    data={this.state.results?.albums?.items}
                                    scrollEnabled={false}
                                    horizontal={false}
                                    renderItem={({item, key}) => (
                                        <AlbumItem album={item} search={true}/>
                                    )}
                                />
                            ) : (
                                <Text>Chargement...</Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
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
    titles: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        color: 'white',
    },
});

const mapStateToProps = store => {
    return {
        store: store,
    };
};

export default connect(mapStateToProps)(SearchScreen);
