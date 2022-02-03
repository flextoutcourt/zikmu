// import React, {useState, useEffect, useContext, Suspense} from 'react'
import axios from 'axios';
import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import Recentitem from './RecentItem';

class RecentComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recent: null,
		};
	}

	_get_recent = async (after = null) => {
		let url = 'https://api.spotify.com/v1/me/player/recently-played';
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
		this._get_recent().then(json => this.setState({recent: json}));
	};

	render() {
		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.state.recent?.items}
					scrollEnabled={true}
					horizontal={true}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						this._get_recent(
							this.state.recent[this.state.recent.items.length]?.item?.track
								?.id ?? null,
						).then(json =>
							this.setState(this.state.recent?.items.concat(json.items)),
						);
					}}
					renderItem={({item, key}) => <Recentitem recent={item}/>}
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
