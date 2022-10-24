import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {connect} from 'react-redux';
import Playlist from '../../components/Genres/Playlist';
import Header from '../../components/Genres/Header';
import SpotifyWebApi from 'spotify-web-api-node';

const SpotifyApi = new SpotifyWebApi();

class GenreScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    SpotifyApi.setAccessToken(this.props.store.authentication.accessToken);
    this.state = {
      genre: null,
      playlists: null, //4
      news: null, //4
      scrollY: new Animated.Value(0),
    };
  }

  _get_playlists = (offset = 0) => {
    const promise = axios.get(
      `https://api.spotify.com/v1/browse/categories/${this.props.route.params.genre_id}/playlists?limit=4&offset=${offset}`,
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

  _get_news = () => {
    axios
      .get('https://api.spotify.com/v1/', {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
      })
      .then(data => this.setState({news: data.data}));
  };

  _get_genre = () => {
    const promise = axios.get(
      `https://api.spotify.com/v1/browse/categories/${this.props.route.params.genre_id}`,
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
    this._get_playlists().then(json =>
      this.setState({playlists: json.playlists.items}),
    );
    this._get_genre().then(json => this.setState({genre: json}));
  }

  render() {
    return (
      <LinearGradient
        colors={['#15202B', '#15202B']}
        style={{
          marginTop: -StatusBar.currentHeight,
          ...styles.container,
          paddingTop: StatusBar.currentHeight,
        }}>
        <Header
          y={this.state.scrollY}
          genre={this.state.genre}
          {...this.props}
        />
        <Animated.ScrollView
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {listener: '', useNativeDriver: true},
          )}
          style={{marginTop: -2.5 * StatusBar.currentHeight}}
          scrollEventThrottle={16}>
          <View style={{marginTop: 2 * StatusBar.currentHeight}}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 18,
                marginVertical: 25,
                textAlign: 'center',
              }}>
              Playlists Populaires
            </Text>
            <FlatList
              data={this.state.playlists}
              renderItem={({item, key}) => <Playlist playlist={item} />}
              numColumns={2}
              ListFooterComponent={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.push('Genre_Popular', {
                        genre: this.state.genre,
                      })
                    }
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: '#7856FF',
                      backgroundColor: '#7856FF',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      elevation: 3,
                    }}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                      Plus
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={{marginBottom: 150}}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 18,
                marginVertical: 25,
                textAlign: 'center',
              }}>
              Nouveautés
            </Text>
            <FlatList
              data={this.state.playlists}
              renderItem={({item, key}) => <Playlist playlist={item} />}
              numColumns={2}
              ListFooterComponent={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.push('Genre_News', {
                        genre: this.state.genre,
                      })
                    }
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: '#7856FF',
                      backgroundColor: '#7856FF',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      elevation: 3,
                    }}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                      Plus
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2732',
  },
});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(GenreScreen);
