import axios from 'axios';
import React from 'react';
import {Dimensions, FlatList, Image, SectionList, StatusBar, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import Animated, {Extrapolate} from 'react-native-reanimated';
import TrackItem from '../../components/Track/TrackItem';
import Header from '../../components/Album/Header';
import moment from 'moment';
import ArtistItem from '../../components/Artist/ArtistItem';

class AlbumScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            album: null,
            disks: null,
            test: null,
            scrollY: new Animated.Value(0),
        };
    }

    _get_album = () => {
        const promise = axios.get(
            `https://api.spotify.com/v1/albums/${this.props.route.params.album_id}`,
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

    _group_by_key = array => {
        let groups = [];
        array.map((item, key) => {
            if (groups[item.disc_number]) {
                groups[item.disc_number].data.push(item);
            } else {
                groups[item.disc_number] = {
                    title: 'Disque ' + item.disc_number,
                    data: [],
                };
                groups[item.disc_number].data.push(item);
            }
        });
        return groups;
    };

    componentDidMount() {
        const opacity = this.state.scrollY.interpolate({
            inputRange: [250, 325],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP,
        });
        this._get_album().then(json => {
            this.setState({album: json});
            this.setState({
                disks: this._group_by_key(json.tracks.items, 'disc_number'),
            });
            this.setState({
                test: this._group_by_key(json.tracks.items, 'disc_number'),
            });
            this.props.navigation.setOptions({
                headerTransparent: true,
                headerTintColor: 'white',
                headerTitle: () => (
                    <Animated.View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: -15,
                            overflow: 'hidden',
                            opacity: this.state.scrollY.interpolate({
                                inputRange: [0, 325],
                                outputRange: [0, 1],
                                extrapolate: Extrapolate.CLAMP,
                            }),
                        }}>
                        {json?.images[0] ? (
                            <Image
                                source={{uri: json?.images[0]?.url}}
                                style={{height: 40, width: 40, borderRadius: 10}}
                            />
                        ) : null}
                        <Text style={{color: 'white', marginLeft: 10, fontWeight: 'bold'}}>
                            {json?.name}
                        </Text>
                    </Animated.View>
                ),
                headerRight: () => (
                    <View>
                        <Icon
                            name="heart"
                            size={24}
                            color={'white'}
                            solid={true}
                        />
                    </View>
                ),
            });
        });
    }

    render() {
        const scale = this.state.scrollY.interpolate({
            inputRange: [-Dimensions.get('screen').height, 0, 125],
            outputRange: [2, 1, 0.5],
            extrapolateRight: Extrapolate.CLAMP,
        });
        const opacity = this.state.scrollY.interpolate({
            inputRange: [0, 200],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP,
        });
        const mb = this.state.scrollY.interpolate({
            inputRange: [0, 125],
            outputRange: [10, -75],
            extrapolate: Extrapolate.CLAMP,
        });

        const br = this.state.scrollY.interpolate({
            inputRange: [0, 10],
            outputRange: [0, 10],
            extrapolate: Extrapolate.CLAMP,
        });

        const height = this.state.scrollY.interpolate({
            inputRange: [0, 125],
            outputRange: [Dimensions.get('screen').width, Dimensions.get('screen').width],
            extrapolate: Extrapolate.CLAMP,
        });

        const mt = this.state.scrollY.interpolate({
            inputRange: [0, Dimensions.get('window').height * 10],
            outputRange: [Dimensions.get('screen').width, 0],
            extrapolate: Extrapolate.CLAMP,
        });

        const borderRadius = this.state.scrollY.interpolate({
            inputRange: [0, 125],
            outputRange: [0, 350],
            extrapolate: Extrapolate.CLAMP,
        });

        const transform = [{scale}];

        const ml = this.state.scrollY.interpolate({
            inputRange: [0, 125],
            outputRange: [StatusBar.currentHeight, 0],
            extrapolate: Extrapolate.CLAMP,
        });
        return (
            <LinearGradient
                colors={['#15202B', '#15202B']}
                style={({marginTop: 0}, styles.container)}>
                <Header
                    y={this.state.scrollY}
                    {...this.props}
                    album={this.state.album}
                />
                <Animated.ScrollView
                    style={{marginTop: -2.5 * StatusBar.currentHeight, zIndex: 98}}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                        {listener: '', useNativeDriver: true},
                    )}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={400}
                    overScrollMode={'always'}>
                    <Text>test</Text>
                    <Animated.View style={{marginTop: mt, paddingBottom: 80}}>
                        {this.state.disks && this.state.test ? (
                            <SectionList
                                scrollEnabled={false}
                                sections={this.state.disks.splice(1)}
                                keyExtractor={({item, index}) => item * index}
                                style={{backgroundColor: '#15202B'}}
                                renderItem={({item, section}) => (
                                    <TrackItem
                                        track={item}
                                        album={this.state.album}
                                        disks={this.state.test}
                                        type={'album'}
                                    />
                                )}
                                ListFooterComponent={() => (
                                    <View style={{padding: 15}}>
                                        <View>
                                            <Text style={{color: 'white'}}>{moment(this.state.album?.release_date).format('DD MMMM YYYY')}</Text>
                                            <Text style={{color: 'white', marginBottom: 10}}>{this.state.album?.total_tracks} titres
                                                - {moment.duration(this.state.album?.full_duration).hours() !== 0 ? moment.duration(this.state.album?.full_duration).hours() + ' h ' : null}{moment.duration(this.state.album?.full_duration).minutes() + ' min '}{moment.duration(this.state.album?.full_duration).seconds() + ' s'}</Text>
                                            <FlatList
                                                data={this.state.album?.artists}
                                                keyExtractor={(item, index) => index.toString()}
                                                ItemSeparatorComponent={() => <View style={{height: 10, width: 10}}></View>}
                                                renderItem={({item}) => (
                                                    <ArtistItem artist_id={item?.id} {...this.props} />
                                                )}
                                            />
                                        </View>
                                        <FlatList
                                            data={this.state.album?.copyrights}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({item}) => {
                                                return (
                                                    <View style={{flexDirection: 'row', marginVertical: 5}}>
                                                        <Icon name={'copyright'} size={18} color="white"/>
                                                        <Text style={{marginLeft: 10, color: "white"}}>{item?.text}</Text>
                                                    </View>
                                                );
                                            }}
                                        />
                                        <Text style={{color: 'white', marginTop: 10}}>{this.state.album?.copyrights[0].text}</Text>
                                    </View>
                                )}
                                renderSectionHeader={({section: {title}}) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            marginLeft: 5,
                                        }}>
                                        <Icon name="disc" size={24} color={"white"}/>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                marginLeft: 10,
                                                color: 'white',
                                                marginVertical: 15,
                                            }}>
                                            {title}
                                        </Text>
                                    </View>
                                )}
                            />
                        ) : null}
                    </Animated.View>
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

export default connect(mapStateToProps)(AlbumScreen);
