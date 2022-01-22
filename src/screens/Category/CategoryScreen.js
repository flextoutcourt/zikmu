import axios from 'axios';
import React, {Suspense} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

class CategoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: null,
      playlistItems: null,
    };
  }

  _get_playlist = (next = null) => {
    let url = `https://api.spotify.com/v1/browse/categories/${this.props.route.params.category_id}/playlists?limit=15`;
    const promise = axios.get(next ?? url, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
    });
    const response = promise.then(data => data.data);
    return response;
  };

  componentDidMount() {
    this._get_playlist().then(json => {
      this.setState({
        playlist: json,
        playlistItems: json.playlists.items,
      });
    });
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: Dimensions.get('screen').width,
        }}>
        <Suspense fallback={null}>
          {this.playlist ? (
            <FlatList
              data={this.playlistItems}
              scrollEnabled={true}
              horizontal={false}
              onEndReachedThreshold={0.5}
              onEndReached={() =>
                this._get_playlist(this.playlist.next).then(json => {
                  this.setState({
                    playlistItems: playlistItems =>
                      playlistItems.concat(json.playlists.items),
                  });
                })
              }
              renderItem={({item, key}) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Playlist', {
                      playlist_id: item.id,
                    })
                  }>
                  <View
                    style={{
                      width: 116,
                      padding: 0,
                      backgroundColor: 'transparent',
                      margin: 5,
                    }}>
                    <Image
                      source={{uri: item?.images[0]?.url}}
                      style={{width: 116, height: 116, margin: 'auto'}}
                    />
                    <View>
                      <Text style={{fontWeight: 'bold', color: 'white'}}>
                        {item?.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : null}
        </Suspense>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = store => {
  props: store.props;
};

export default connect(mapStateToProps)(CategoryScreen);
