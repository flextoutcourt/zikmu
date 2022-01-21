import React, { useContext } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect, ReactReduxContext} from 'react-redux';

class TrackItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _set_offset = (disc_number, track_number) => {
    let offset = 0;
    while (disc_number > 0) {
      offset += this.props.disks[disc_number - 1]?.data?.length ?? 0;
      disc_number--;
    }
    return offset + track_number;
  };

  _play = (uri, track_number, disc_number = 1) => {
    let offset = 0,
      body = {};
    if (this.props.type == 'album') {
      offset = this._set_offset(disc_number, track_number);
    }
    if (this.props.type == 'album') {
      body = {
        context_uri: uri,
        offset: {
          position: offset - 1,
        },
        position_ms: 0,
      };
    } else if (this.props.type == 'playlist') {
      console.log(this.props.playlist_index);
      body = {
        context_uri: this.props.playlist_uri,
        offset: {
          position: this.props.playlist_index,
        },
        position_ms: 0,
      };
    } else {
      body = {
        uris: [uri],
        offset: {
          position: offset - 1,
        },
        position_ms: 0,
      };
    }

    fetch('https://api.spotify.com/v1/me/player/play', {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }).catch(e => {
      alert(JSON.stringify(e));
    });
  };

  render() {
    return (
      <TouchableOpacity
        onPress={() =>
          this._play(
            this.props.type == 'album'
              ? this.props.album?.uri
              : this.props.type == 'playlist'
              ? this.props.track?.uri
              : this.props.track?.uri,
            this.props.track?.track_number,
            this.props.track?.disc_number,
          )
        }>
        <View
          style={{
            width: 116,
            padding: 0,
            margin: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: Dimensions.get('screen').width - 20,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', elevation: 5}}>
            <Image
              source={{uri: this.props.album?.images[2]?.url}}
              style={{width: 50, height: 50, borderRadius: 10}}
            />
          </View>
          <View
            style={{
              marginLeft: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 10,
            }}>
            <View>
              <Text
                style={{fontWeight: 'bold', color: 'white'}}
                numberOfLines={1}>
                {this.props.track?.name}
              </Text>
              <FlatList
                data={this.props.track?.artists}
                scrollEnabled={true}
                horizontal={true}
                ItemSeparatorComponent={() => <Text>, </Text>}
                renderItem={({item, key}) => (
                  <Text style={{color: 'white'}}>{item.name}</Text>
                )}
              />
            </View>
            <TouchableOpacity>
              <Icon
                name="heart"
                size={24}
                solid={this.props.favorites ? true : false}
                color={'white'}
                style={{color: 'white'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(TrackItem);
