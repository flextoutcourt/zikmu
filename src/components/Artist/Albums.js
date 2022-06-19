import axios from 'axios';
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import AlbumItem from '../Album/AlbumItem';

class Albums extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            albums: null,
        };
    }

    _get_artist_album = () => {
        const promise = axios.get(
            `https://api.spotify.com/v1/artists/${this.props.artist.id}/albums`,
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
        this._get_artist_album().then(json => this.setState({albums: json}));
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10, color: 'white'}}>Albums
                    de {this.props.artist?.name}</Text>
                <FlatList
                    data={this.state.albums?.items}
                    horizontal={true}
                    style={{marginBottom: 50}}
                    renderItem={({item, key}) => <AlbumItem {...this.props} album={item}/>}
                />
            </View>
        );
    }
}

const mapStateToProps = store => {
    return {
        store: store,
    };
};

export default connect(mapStateToProps)(Albums);
