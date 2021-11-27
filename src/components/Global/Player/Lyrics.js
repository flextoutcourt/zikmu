import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, FlatList} from 'react-native'
import MD5 from 'crypto-js/md5';

import axios from 'axios'

function Lyrics({track}) {

    const [lyrics, setLyrics] = useState(null);
    const [lastTrack, setLastTrack] = useState(track);
    const [first, setFirst] = useState(true);
    const [baseU, setBaseU] = useState(null);
    
    const _get_lyrics = (lt = lastTrack) => {
        if(first){
            console.log('processed')
            axios.get(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${track?.name}&q_artist=${track?.artists[0].name}&apikey=e0d2458b91da40316ebf92ac27cde04a`)
            .then((data) => {
                setLyrics(data.data.message.body);
                console.log(data.data.message.body.lyrics.pixel_tracking_url, data.data.message.body.lyrics.script_tracking_url);
            });
            setFirst(false);
        }else if(lt?.name != track?.name || lt?.artists[0]?.name != track?.artists[0]?.name){
            console.log('processed')
            axios.get(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${track?.name}&q_artist=${track?.artists[0].name}&apikey=e0d2458b91da40316ebf92ac27cde04a`)
            .then((data) => {
                setLyrics(data.data.message.body);
            });
        }
        setLastTrack(track);
    }
    useEffect(() => {
        _get_lyrics();
    })

    // const _create_base_url = () => {
    //     let promise, response, base_url;
    //     console.log('trackingurlcalled');
    //     if(!baseU){
    //         console.log('trackingurlprocessed');
    //         promise = axios.get('http://api.musixmatch.com/ws/1.1/tracking.url.get?apikey=e0d2458b91da40316ebf92ac27cde04a&format=json&domain=192.168.1.57');
    //         response = promise.then((data) => setBaseU(data.data.message.body.url));
    //     }
    // }

    // const _create_tracking_url = (t) => {
    //     let track_name = track?.name,
    //         artist_name = track?.artists[0].name,
    //         api_key = "e0d2458b91da40316ebf92ac27cde04a",
    //         base_url = _create_base_url(),
    //         tracking_url = `${baseU}?artist_name=${encodeURI(artist_name)}&track_name=${encodeURI(track_name)}`,
    //         signature = MD5(t+api_key),
    //         final_url = `${tracking_url}&s=${signature}`;

    //         console.log('base_url = ' + final_url);
    //         return final_url;
    // }

    return (
        <View style={{flex: 1, padding: 10}}>
            <FlatList
                data={lyrics?.lyrics?.lyrics_body.split("\n")}
                scrollEnabled={true}
                horizontal={false}
                nestedScrollEnabled
                ItemSeparatorComponent={() => (
                    <Text>{"\n\n"}</Text>
                )}
                renderItem={({item, key}) => (
                    <Text style={{color: 'white', fontSize: 40, fontWeight: 'bold'}}>{item}</Text>
                )}
            />
            {/* <Image source={{uri: lyrics?.lyrics?.pixel_tracking_url}} style={{height: 450, width: '100%'}} /> */}
        </View>
    )
}

export default Lyrics;
