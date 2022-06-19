import axios from 'axios';
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import ArtistAlt from './ArtistAlt';

class RelatedArtists extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            related: null,
        };
    }

    _get_artist_related = () => {
        const promise = axios.get(
            `https://api.spotify.com/v1/artists/${this.props.artist.id}/related-artists`,
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
        this._get_artist_related().then(json => this.setState({related: json}));
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10, color: 'white'}}>Similaires
                    a {this.props.artist?.name}</Text>
                <FlatList
                    data={this.state.related?.artists}
                    horizontal={true}
                    style={{marginBottom: 110}}
                    renderItem={({item, key}) => <ArtistAlt {...this.props} artist={item}/>}
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

export default connect(mapStateToProps)(RelatedArtists);
