import React, { useContext } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect, ReactReduxContext } from 'react-redux';

class TrackItem extends React.Component {

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

    render(){
        return (
            <TouchableOpacity onPress={() => this._play(this.props.track?.uri, this.props.track?.track_number)}>
                <View style={{width: 116, padding: 0, margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Dimensions.get('screen').width - 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', elevation: 5}}>
                        <Image source={{uri: this.props.album?.images[2]?.url}}
                        style={{width: 50, height: 50, borderRadius: 10}} />
                    </View>
                    <View style={{marginLeft: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}}>
                        <Text style={{fontWeight: 'bold', color: 'white'}} numberOfLines={1}>{this.props.track?.name}</Text>
                        <TouchableOpacity>
                            <Icon name="heart" size={24} solid={this.props.favorites ? true: false} color={"white"} style={{color: 'white'}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(TrackItem);
