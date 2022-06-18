// import React, {useState, useEffect, useContext, Suspense} from 'react'
import axios from 'axios';
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import Recentitem from './RecentItem';

class RecentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recent: null,
    };
  }

  /**
   * @description: get recent data from server
   * @param {string} after
   * @returns {Promise<AxiosResponse<any>>}
   * @private
   */
  _get_recent = (after = null) => {
    let limit = this.props.isTop ? 12 : 50;
    let url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
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

  /**
   * sort the array after being grouped by album
   * @param {array} json
   * @returns {*}
   * @private
   */
  _sort_array = json => {
    return this._group_by_album(json);
  };

  /**
   * group a given array
   * @param {array} json
   * @returns {*}
   * @private
   */
  _group_by_album = json => {
    let array = {};
    json.items = json.items.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          t => t.place === value.place && t.track.id === value.track.id,
        ),
    );

    return json.items;
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  componentDidMount = () => {
    this._get_recent().then(json => {
      this.setState({recent: json.items});
      super.forceUpdate();
    });
  }

    render()
    {
      return (
        <View style={{flex: 1}}>
          {this.props.isTop ? (
            <FlatList
              data={this.state.recent?.splice(0, 8)}
              scrollEnabled={true}
              numColumns={2}
              onEndReachedThreshold={0.5}
              style={{paddingBottom: 20}}
              renderItem={({item, index}) => (
                <Recentitem recent={item} iterator={index} {...this.props} />
              )}
            />
          ) : (
            <>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  marginTop: 5,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                Écouté recemment
              </Text>
              <FlatList
                data={this.state.recent?.splice(8)}
                scrollEnabled={true}
                horizontal={true}
                onEndReachedThreshold={0.5}
                style={{paddingBottom: 20}}
                onEndReached={() => {
                  // alert(new Date(this.state.recent[this.state.recent.length - 1].played_at).getTime());
                  this._get_recent(
                    new Date(
                      this.state.recent[this.state.recent.length - 1].played_at,
                    ).getTime() ?? null,
                  ).then(json =>
                    this.setState(prevState => {
                      recent: [...prevState, this._sort_array(json)];
                    }),
                  );
                }}
                renderItem={({item, index}) => (
                  <Recentitem recent={item} iterator={index} {...this.props} />
                )}
              />
            </>
          )}
        </View>
      );
    }
  }

  const
  mapStateToProps = store => {
    return {
      store: store,
    };
  };

  export
  default

  connect(mapStateToProps)

(
  RecentComponent
)
  ;
