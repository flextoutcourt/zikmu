import axios from 'axios';
import React from 'react';
import {connect} from 'react-redux';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

class ArtistAlt extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            artist: props.artist,
        };
    }

    componentDidMount() {
        this._get_artist(this.state.artist?.id).then(j => {
            this.setState({artist: j});
        });
    }

    _get_artist = (artist_id) => {
        const promise = axios.get(`https://api.spotify.com/v1/artists/${artist_id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                'Content-Type': 'application/json',
            },
        });
        return promise.then(data => data.data);
    };

    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.push('Artist', {
                        artist_id: this.props.artist?.id,
                    });
                }}
                style={{flexDirection: 'column', alignItems: 'center', margin: 10}}
            >
                <Image source={{uri: this.state.artist?.images[1]?.url}}
                       style={{...styles.images, borderRadius: this.state.artist?.images[1]?.height}}/>
                <Text style={{
                    ...styles.text,
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '800',
                }}>{this.state.artist?.name}</Text>
            </TouchableOpacity>
        );
    }
}

const numItems = 3;
const margin = 10;

const styles = StyleSheet.create({
    images: {
        height: (Dimensions.get('screen').width - margin * numItems * 2) / numItems,
        width: (Dimensions.get('screen').width - margin * numItems * 2) / numItems,
        marginRight: 0,
    },
    text: {
        maxWidth: (Dimensions.get('screen').width - margin * numItems * 2) / numItems,
    },
});

const mapStateToProps = store => {
    return {
        store: store,
    };
};

export default connect(mapStateToProps)(ArtistAlt);
