import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import TrackItem from '../Track/TrackItem';

class AlbumItemWithOffset extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            tracks: null,
            album: null,
            test: null,
        }
    }

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

    _get_next_titles = () => {
        axios.get(`${this.props.context?.href}/tracks`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.store.authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
        .then(data => data.data)
        .then(response => this.setState({
            tracks: this._sort_titles(response.items),
            test: (this.props.context.type === 'album' ? this._group_by_key(response.items, 'disc_number'): null)
        }));
    }

    _sort_titles = (titles) => {
        if(this.props.context.type == 'playlist'){
            return titles.splice(titles.findIndex(title => title.track.id == this.props.listening.item.id) +1);
        }else{
            return titles.splice(titles.findIndex(title => title.id == this.props.listening.item.id) +1);
        }
    }


    _get_album_details = () => {
        axios.get(`${this.props.context?.href}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.store.authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
            .then(data => data.data)
            .then(response => this.setState({album: response}));
    }

    componentDidMount() {
        setTimeout(() => {
            this._get_next_titles();
            this._get_album_details();
        }, 400)
    }

    render(){
        return(
            <View style={{flex: 1, elevation: -1}}>
                <FlatList
                    data={this.state.tracks}
                    renderItem={({item, key}) => (
                        <TrackItem
                            track={this.props.context.type == 'album' ? item : item.track}
                            album={this.props.context.type == 'album' ? this.state.album : item.track.album}
                            type={this.props.context.type == 'album' ? 'album' : this.props.context.type == 'playlist' ? 'playlist' : null}
                            disks={this.state.test}
                        />
                    )}
                />
            </View>
        )
    }

}

const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(AlbumItemWithOffset)
