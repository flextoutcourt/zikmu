import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { connect, ReactReduxContext } from 'react-redux'

import axios from 'axios'

function Lyrics({track}) {

    const {store} = useContext(ReactReduxContext);

    const [lyrics, setLyrics] = useState(null);
    
    const _get_track_uid = () => {
        const promise = axios.get(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${track.name}&q_artist=${track.artists[0].name}&apikey=e0d2458b91da40316ebf92ac27cde04a`);
        const response = promise.then((data) => _get_lyrics(data.data).then(json => json));
        return response;
    }
    
    const _get_lyrics = (track_uid) => {
        const promise = axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${track_uid}&apikey=e0d2458b91da40316ebf92ac27cde04a`);
        const response = promise.then((data) => data.data);
        return response;
    }

    useEffect(() => {
        _get_track_uid().then(json => setLyrics(json));
    })

    return (
        <View>
            <Text>
                {
                    lyrics?.lyrics?.lyrics_body
                }
            </Text>
        </View>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(Lyrics);
