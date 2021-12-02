import axios from 'axios';
import React from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, View, SectionList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import Animated, {interpolate, Extrapolate, useAnimatedScrollHandler} from 'react-native-reanimated';
import TrackItem from '../../components/Track/TrackItem';
import {  onScrollEvent} from 'react-native-redash/lib/module/v1';

class AlbumScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            album: null,
            disks: null,
            test: null,
            scrollY: new Animated.Value(0)
        }
    }
    
    _get_album = () => {
        const promise = axios.get(`https://api.spotify.com/v1/albums/${this.props.route.params.album_id}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.store.authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
        const response = promise.then((data) => data.data);
        return response;
    }

    _group_by_key = (array) => {
        let groups = [];
        array.map((item, key) => {
            if(groups[item.disc_number]){
                groups[item.disc_number].data.push(item);
            }else{
                groups[item.disc_number] = {
                    title: 'Disque ' + item.disc_number,
                    data: [],
                };
                groups[item.disc_number].data.push(item);
            }
        })
        return groups;

    }

    handlerScroll = (e) => {
        if(e.contentOffset.y > 150){
            this.props.navigation.setOptions({
                headerShown: true,
            })
        }else{
            this.props.navigation.setOptions({
                headerShown: false
            })
        }
    }
    
    componentDidMount(){
        this._get_album().then(json => {
            this.setState({album: json});
            this.setState({disks :this._group_by_key(json.tracks.items, 'disc_number')});
            this.setState({test :this._group_by_key(json.tracks.items, 'disc_number')});
            this.props.navigation.setOptions({
                headerTransparent: true,
                headerTintColor: 'white',
                headerTitle: () => (
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -15, overflow: 'hidden'}}>
                        {json?.images[0]
                            ?
                                <Image source={{uri: json?.images[0]?.url}} style={{height: 40, width: 40, borderRadius: 10}} />
                            :
                                null
                        }
                        <Text style={{color: 'white', marginLeft: 10, fontWeight: 'bold'}}>{json?.name}</Text>
                    </View>
                ),
                headerRight: () => (
                    <View>
                        <FontAwesome5Icon name='heart' size={24} color={"white"} solid={true} />
                    </View>
                )
            })
        });
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
            <LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: -StatusBar.currentHeight}, styles.container}>
                <Animated.ScrollView 
                    onScroll={
                        Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY }}}],
                            { listener: '', useNativeDriver: true },
                        )
                    }
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={400}
                    overScrollMode={'always'}
                >
                    <Animated.View style={{alignItems: 'flex-start', justifyContent: 'flex-start', elevation: 10, margin: 10,marginBottom: mt, transform: transform, width: Dimensions.get('screen').width - 20, height: Dimensions.get('screen').width - 20, opacity: opacity, marginTop: 2 * StatusBar.currentHeight}}>
                        <Image source={{uri: this.state.album?.images[0]?.url}} style={{width: "100%", height: '100%', marginBottom: 15, borderRadius: 10}}/>
                    </Animated.View>
                    <Animated.Text style={{fontSize: 24, color: 'white', textAlign: 'center', opacity: opacity}}>{this.state.album?.name}</Animated.Text>
                    {
                        this.state.disks && this.state.test
                        ?
                            <SectionList
                                scrollEnabled={false}
                                sections={this.state.disks.splice(1)}
                                keyExtractor={({item, index}) => item * index}  
                                renderItem={({item, section}) => (
                                    <TrackItem track={item} album={this.state.album} disks={this.state.test} type={"album"} />
                                )}
                                renderSectionHeader={({ section: { title } }) => (
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', marginLeft: 5}}> 
                                        <FontAwesome5Icon name='compact-disc' size={24}/>
                                        <Text style={{fontSize: 18, marginLeft: 10, color: 'white', marginVertical: 15}}>{title}</Text>
                                    </View>
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
    return{
        store: store
    }
}

export default connect(mapStateToProps)(AlbumScreen)