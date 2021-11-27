import React, {useEffect, useState, useContext} from 'react'
import { View, Text, TouchableOpacity, Image, Alert, Button, TouchableHighlight, Dimensions, FlatList, ScrollView, StatusBar} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

import dominantColors from 'dominant-colors'

import * as rootNavigation from './../../utils/RootNavigation';

import {ReactReduxContext, connect} from 'react-redux';

import axios from 'axios';
import Lyrics from './Player/Lyrics';

function Player() {

    const [listening, setListening] = useState(null);
    const [big, setBig] = useState(false);
    const [paroles, setParoles] = useState(false);

    const [mainColor, setMainColor] = useState('#636363');

    const { store } = useContext(ReactReduxContext);

    setTimeout(() => {
        _get_listening().then(json => {
            setListening(json)
        });
    }, 1000);


    const _get_listening = () => {
        const promise = axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            },
        });
        const response = promise.then(data => data.data);
        return response;
    }

    const _pause = () => {
        axios.put('https://api.spotify.com.v1/me/player/pause', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
    }

    const _play = () => {
        axios.put('https://api.spotify.com.v1/me/player/play', {
            body: `{"context_uri\\":\\"${listening?.item?.uri}\\",\\"position_ms\\":${listening?.progress_ms}}`,
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
    }

    const _next = () => {
        axios.put('https://api.spotify.com/v1/me/player/next', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        })   
    }

    const _prev = () => {
        axios.put('https://api.spotify.com/v1/me/player/previous', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
    }

    const _shuffle = () => {
        axios.put(`https://api.spotify.com/v1/me/player/shuffle?state=${!listening?.shuffle_state}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
    }

    const _repeat = () => {
        let state;
        if(listening?.repeat_state == 'context'){
            state = 'track';
        }else if(listening?.repeat_state == 'track'){
            state = false;
        }else{
            state = 'context';
        }
        axios.put(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
    }

    return (
        listening
        ?
        <TouchableOpacity
            style={{position: 'absolute', bottom: big ? 0 : 60, top : big ? 0 : null , left: big ? 0 : 2, right: big ? 0 : 2, backgroundColor: big ? mainColor : mainColor, zIndex: 99, padding: 0, borderRadius: big ? 0 : 10}}
            onPress={() => {!big ? setBig(true) : null}}
            activeOpacity={big ? 1 : 0.2}
        >
            {
                big
                ?
                    <ScrollView style={{padding: 10}}>
                        <View style={{flex: 2.5}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: StatusBar.currentHeight}}>
                                <TouchableOpacity onPress={() => setBig(false)}>
                                    <Icon name="arrow-left" size={24} color={"white"}/> 
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon name="ellipsis-v" size={24} color={"white"}/> 
                                </TouchableOpacity>
                            </View>
                            <Text numberOfLines={1} style={{fontSize: 24, textAlign: 'center', color: 'white', marginBottom: 20}}>{listening?.item?.album?.name}</Text>
                            <Image
                                source={{uri: listening?.item?.album?.images[0]?.url}}
                                style={{width: Dimensions.get('screen').width - 24, height: Dimensions.get('screen').width - 24, borderRadius: 10}}
                            />
                            <TouchableOpacity onPress={() => {}} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: "50%", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, borderWidth: 2, borderColor: 'white', borderStyle: 'solid', marginTop: 10}}>
                                <View style={{fontSize: 18, color: 'white', flexDirection: 'row'}}>
                                    <Icon name='heart' size={24} color={"white"} />
                                    <Text style={{paddingLeft: 10, fontSize: 16}}>Ajouter</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                            <View style={{flexDirection: 'row', marginTop: 15, width: '100%'}}>
                                <Text>{Math. floor((listening?.progress_ms / 1000 / 60) << 0)}:{Math.floor((listening?.progress_ms / 1000) % 60).toString().padStart(2, '0')}</Text>
                                <View style={{height: 2, backgroundColor: 'tomato', flex: 1, alignSelf: 'center', marginLeft: 5, marginRight: 5}}>
                                    <View style={{position: 'relative',height: 2, backgroundColor: 'grey', width: (listening?.progress_ms) / (listening?.item?.duration_ms) * 100 + "%"}}>
                                        <View style={{borderRadius: 100, height: 8, width: 8, backgroundColor: 'red', position: 'absolute', top: '50%', right: 0, transform : [{translateY: -4}]}}></View>
                                    </View>
                                    
                                </View>
                                <Text>{Math. floor((listening?.item?.duration_ms / 1000 / 60) << 0)}:{Math.floor((listening?.item?.duration_ms / 1000) % 60).toString().padStart(2, '0')}</Text>
                            </View>
                            <View>
                                <Text numberOfLines={1} style={{fontSize: 24, color: 'white', textAlign: 'center', marginVertical: 15}}>
                                    {listening?.item?.name}
                                </Text>
                                <View style={{marginBottom: 10}}>
                                    <FlatList
                                        data={listening?.item?.artists}
                                        scrollEnabled={true}
                                        horizontal={true}
                                        ItemSeparatorComponent={() => (
                                            <Text>, </Text>
                                        )}
                                        renderItem={({item, key}) => (
                                            <TouchableOpacity onPress={() => rootNavigation.navigate('Artist', {
                                                artist_id: item.id
                                            })}>
                                                <Text style={{color: 'white'}}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 10}}>
                                <TouchableOpacity onPress={() => {_shuffle()}}>
                                    <Icon name="random" size={24} style={{color: listening?.shuffle_state ? 'green' : 'white'}} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => _prev()}>
                                    <Icon name="caret-left" size={48} style={{color: 'white'}}/>
                                </TouchableOpacity>
                                {
                                    listening.is_playing
                                    ?
                                        <TouchableOpacity
                                        onPress={() => {
                                                _pause()
                                            }}
                                        >
                                            <Icon name="pause" size={48} style={{marginLeft: 5, marginRight: 5, color: "white"}} />
                                        </TouchableOpacity>
                                    :
                                        <TouchableOpacity 
                                            onPress={() => {
                                                _play()
                                            }}
                                        >
                                            <Icon name="play" size={48} style={{marginLeft: 5, marginRight: 5, color: "white"}} />
                                        </TouchableOpacity>

                                }
                                <TouchableOpacity onPress={() => _next()}>
                                    <Icon name="caret-right" size={48} style={{color: 'white'}} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {_repeat()}}>
                                    <Icon name="redo" size={24} style={{color: listening?.repeat_state == 'context' ? 'green' : listening?.repeat_state == 'track' ? 'purple' : 'white' }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 25, marginTop: 10}}>
                                <TouchableOpacity onPress={() => {}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{marginRight: 10}}>File d'attente</Text>
                                    <Icon name="list" size={24} style={{color: 'white'}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{backgroundColor: 'blue', borderRadius: 10, marginBottom: 50, height: paroles ? null : 450, width: '100%', marginVertical: 25, elevation: 5, position: paroles ? 'absolute' : 'relative', top: paroles ? 5 : null, left: paroles ? 5 : null, right: paroles ? 5 : null, bottom: paroles ? 5 : null, overflow: 'hidden'}}>
                            <Lyrics track={listening?.item} style={{color: 'white'}} />
                        </View>
                    </ScrollView>
                :
                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', flex: 3, overflow: 'hidden'}}>
                                <Image source={{uri: listening?.item?.album?.images[0]?.url}} style={{width: 50, height: 50, margin: "auto", borderRadius: 10}} />
                                <View style={{marginLeft: 5}}>
                                    <Text style={{color: 'white'}}>{listening?.item?.name}</Text>
                                    <Text style={{color: 'lightgrey'}}>{listening?.item?.artists[0]?.name}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center', zIndex: 99}}>
                                <Icon name="home" size={24} style={{marginLeft: 5, marginRight: 5}} />
                                <Icon name="heart" size={24} style={{marginLeft: 5, marginRight: 5, color: 'white'}} />
                                {
                                    listening.is_playing
                                    ?
                                        <TouchableHighlight
                                        onPress={() => {
                                                _pause()
                                            }}
                                        >
                                            <Icon name="pause" size={24} style={{marginLeft: 5, marginRight: 5, color: 'white'}} />
                                        </TouchableHighlight>
                                    :
                                        <TouchableHighlight 
                                            onPress={() => {
                                                _play()
                                            }}
                                        >
                                            <Icon name="play" size={24} style={{marginLeft: 5, marginRight: 5, color: 'white'}} />
                                        </TouchableHighlight>

                                }
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 5, width: '100%'}}>
                            <Text>{Math. floor((listening?.progress_ms/1000/60) << 0)}:{Math.floor((listening?.progress_ms/1000) % 60).toString().padStart(2, '0')}</Text>
                            <View style={{height: 2, backgroundColor: 'tomato', flex: 1, alignSelf: 'center', marginLeft: 5, marginRight: 5}}>
                                <View style={{height: 2, backgroundColor: 'grey', width: (listening?.progress_ms) / (listening?.item?.duration_ms) * 100 + "%"}}></View>
                            </View>
                            <Text>{Math. floor((listening?.item?.duration_ms/1000/60) << 0)}:{Math.floor((listening?.item?.duration_ms/1000) % 60).toString().padStart(2, '0')}</Text>
                        </View>
                    </View>
                }   
        </TouchableOpacity>
        :
            null
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(Player);