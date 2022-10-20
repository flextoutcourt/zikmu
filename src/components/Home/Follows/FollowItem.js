import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';

class Recentitem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  _play = (uri, offset = 0, position = 0) => {
    console.log(uri, offset, position);
    fetch('https://api.spotify.com/v1/me/player/play', {
      body: JSON.stringify({uris: [uri]}),
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

  _margin = () => {
    if (this.props.iterator % 2) {
      return {marginLeft: 5, marginRight: 10, marginVertical: 5};
    } else {
      return {marginLeft: 10, marginRight: 5, marginVertical: 5};
    }
  };

  componentDidMount() {}

  render() {
    return (
      <View
        style={{
          width: Dimensions.get('screen').width / 2 - 15,
          borderRadius: 10,
          ...this._margin(),
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.push('Artist', {
              artist_id: this.props.follow?.id,
            });
          }}
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <View
            style={{
              elevation: 10,
              backgroundColor: 'black',
              width: Dimensions.get('screen').width / 2 - 15,
              height: Dimensions.get('screen').width / 2 - 15,
              borderRadius: Dimensions.get('screen').width / 2 - 15,
            }}>
            <Image
              source={{uri: this.props.follow?.images[0]?.url}}
              style={{
                borderRadius: Dimensions.get('screen').width / 2 - 15,
                ...StyleSheet.absoluteFill,
              }}
            />
          </View>
          <View style={{marginLeft: 5}}>
            <Text
              numberOfLines={1}
              style={{
                maxWidth: Dimensions.get('screen').width / 2 - 73,
                color: 'white',
              }}>
              {this.props.recent?.track?.album?.name}
            </Text>
            <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
              {this.props.follow?.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(Recentitem);
