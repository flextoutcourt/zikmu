// import React, {useState, useEffect, useContext, Suspense} from 'react'
import axios from 'axios';
import React, {Component} from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import FollowItem from './FollowItem';

class RecentComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            follows: null,
        };
    }

    _get_follows = async (after = null) => {
        let limit = this.props.isTop ? 8 : 50;
        let url = `https://api.spotify.com/v1/me/following?type=artist`;
        after ? (url += `?after=${after}`) : url;
        const promise = axios.get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                'Content-Type': 'application/json',
            },
        });
        return promise.then(data => data.data);
    };

    componentDidMount = () => {
        this._get_follows().then(json => this.setState({follows: json.artists?.items}));
    };

    render() {
        return (
            <View style={{flex: 1, paddingBottom: 155}}>
                <Text style={{fontSize: 16, color: 'white', marginLeft: 10, marginBottom: 10}}>Vos artistes</Text>
                <FlatList
                    data={this.state.follows}
                    scrollEnabled={true}
                    horizontal={true}
                    onEndReachedThreshold={0.5}
                    style={{paddingBottom: 20}}
                    renderItem={({item, index}) => <FollowItem follow={item} {...this.props} />}
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

export default connect(mapStateToProps)(RecentComponent);
