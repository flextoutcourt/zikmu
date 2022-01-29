import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity, Vibration,
  View,
} from 'react-native';

import GLOBAL from './../../screens/Entry/EntryScreen';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import Liked from "./Liked";
import Collab from "./Collab";

class TrackItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      track: props.track,
      isCollab: false
    }
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
    Vibration.vibrate(10)
    let offset = 0,
      body = {};
    if (this.props.type === 'album') {
      offset = this._set_offset(disc_number, track_number);
    }
    if (this.props.type === 'album') {
      body = {
        context_uri: uri,
        offset: {
          position: offset - 1,
        },
        position_ms: 0,
      };
    } else if (this.props.type === 'playlist') {
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
      <View>
        <TouchableOpacity
          onPress={() =>
            this._play(
              this.props.type === 'album'
                ? this.props.album?.uri
                : this.props.type === 'playlist'
                ? this.state.track?.uri
                : this.state.track?.uri,
              this.state.track?.track_number,
              this.state.track?.disc_number,
            )
          }>
          <View
            style={{
              padding: 0,
              margin: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: Dimensions.get('screen').width - 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                elevation: 5,
              }}>
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
                  style={{fontWeight: 'bold', color: 'white', maxWidth: (Dimensions.get('screen').width / 3 ) * 1.7}}
                  numberOfLines={1}
                >
                  {this.state.track?.name}
                </Text>
                <FlatList
                  data={this.state.track?.artists}
                  scrollEnabled={true}
                  horizontal={true}
                  ItemSeparatorComponent={() => <Text>, </Text>}
                  renderItem={({item, key}) => (
                    <Text style={{color: 'white'}}>{item.name}</Text>
                  )}
                  contentContainerStyle={{maxWidth: Dimensions.get('screen').width / 1.9}}
                />
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Collab isCollab={this.state.track?.name === '696' || this.state.track?.name === "2014"} />
                <Liked track={this.state.track} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(TrackItem);
