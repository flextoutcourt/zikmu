import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { play } from '../../../redux/features/play';

class Recentitem extends Component {

    constructor(props){
        super(props);
    }

    _play = (uri, offset = 0, position = 0) => {
        console.log(uri, offset, position)
        fetch("https://api.spotify.com/v1/me/player/play", {
            body: JSON.stringify({uris: [uri]}),
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.store.authentication.accessToken,
                "Content-Type": "application/json"
            },
            method: "PUT"
        })
        .catch(e => {
            alert(JSON.stringify(e))
        })
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this._play(this.props.recent?.track?.uri);
                    }}
                >
                    <Text>{this.props.recent?.track?.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({})

const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(Recentitem);
