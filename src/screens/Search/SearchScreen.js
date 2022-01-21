import axios from 'axios';
import React from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import ArtistItem from '../../components/Artist/ArtistItem';
import TrackItem from '../../components/Track/TrackItem';
import AlbumItem from '../../components/Album/AlbumItem';

/** components */

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      results: null,
      loading: false,
    };
  }

  _search = e => {
    this.setState({search: e});
    this.setState({loading: true});
    if (e === '') {
      this.setState({results: null});
    }
    axios
      .get(
        `https://api.spotify.com/v1/search?q=${e}&limit=24&type=track,artist,album`,
        {
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer ' + this.props.store.authentication.accessToken,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(data => this.setState({results: data.data}))
      .finally(() => {
        this.setState({loading: false});
      });
  };

  _renderHeaderComponent = (label, type) => {
    return type?.items?.length > 0 ? (
      <View
        styles={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: 'red',
          width: Dimensions.get('screen').width,
        }}>
        <Text style={styles.titles}>{label}</Text>
      </View>
    ) : null;
  };

  componentDidMount() {}

  render() {
    // const mh = this.state.scrollY.interpolate({
    //   inputRange: [0, 70],
    //   outputRange: [10, 0],
    // });
    // const w = this.state.scrollY.interpolate({
    //   inputRange: [0, 70],
    //   outputRange: [
    //     Dimensions.get('screen').width - 20,
    //     Dimensions.get('screen').width,
    //   ],
    //   extrapolate: Extrapolate.CLAMP,
    // });
    return (
      <LinearGradient
        colors={['#B00D72', '#5523BF']}
        style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
        <ScrollView
          style={{
            flex: 1,
          }}
          stickyHeaderIndices={[0]}>
          <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}>
            <View
              style={{
                paddingTop: 1.2 * StatusBar.currentHeight,
                marginHorizontal: 0,
                paddingHorizontal: 10,
                marginBottom: 25,
              }}>
              <TextInput
                onChangeText={this._search}
                placeholder={'Rechercher'}
                value={this.state.search}
                style={{
                  width: Dimensions.get('screen').width - 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(176, 13, 114, 1)',
                  padding: 10,
                  elevation: 10,
                }}
              />
            </View>
          </LinearGradient>
          <View style={{paddingHorizontal: 10}}>
            <View>
              {this._renderHeaderComponent(
                'Artistes',
                this.state.results?.artists,
              )}
              {!this.state.loading ? (
                <FlatList
                  numColumns={3}
                  data={this.state.results?.artists?.items}
                  scrollEnabled={false}
                  renderItem={({item, key}) => <ArtistItem artist={item} />}
                />
              ) : (
                <Text>Chargement...</Text>
              )}
            </View>
            <View>
              {this._renderHeaderComponent(
                'Titres',
                this.state.results?.tracks,
              )}
              {!this.state.loading ? (
                <FlatList
                  data={this.state.results?.tracks?.items}
                  scrollEnabled={false}
                  horizontal={false}
                  listHeaderComponent={this._renderHeaderComponent(
                    'Titres',
                    this.state.results?.tracks,
                  )}
                  renderItem={({item, key}) => (
                    <TrackItem track={item} album={item.album} />
                  )}
                />
              ) : (
                <Text>Loading</Text>
              )}
            </View>
            <View style={{marginBottom: 110}}>
              {this._renderHeaderComponent(
                'Albums',
                this.state.results?.albums,
              )}
              {!this.state.loading ? (
                <FlatList
                  numColumns={2}
                  data={this.state.results?.albums?.items}
                  scrollEnabled={false}
                  horizontal={false}
                  renderItem={({item, key}) => (
                    <AlbumItem album={item} search={true} />
                  )}
                />
              ) : (
                <Text>Chargement...</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  titles: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(SearchScreen);
