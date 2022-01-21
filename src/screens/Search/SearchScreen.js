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
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import ArtistItem from '../../components/Artist/ArtistItem';
import TrackItem from '../../components/Track/TrackItem';

/** components */

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      results: null,
    };
  }

  _search = e => {
    this.setState({search: e});
    axios
      .get(
        `https://api.spotify.com/v1/search?q=${e}&limit=3&type=track,artist,album`,
        {
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer ' + this.props.store.authentication.accessToken,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(data => this.setState({results: data.data}));
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
          style={{flex: 1, marginTop: StatusBar.currentHeight}}>
          <View
            style={{
              paddingTop: 0.5 * StatusBar.currentHeight,
              marginHorizontal: 0,
            }}>
            <TextInput
              onChangeText={this._search}
              placeholder={'Rechercher'}
              value={this.state.search}
              style={{
                width: Dimensions.get('screen').width - 20,
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 10,
              }}
            />
          </View>
          <View>
            {this.state.results?.artists?.items?.length > 0 ? (
              <Text>Artistes</Text>
            ) : null}
            <FlatList
              data={this.state.results?.artists?.items}
              scrollEnabled={false}
              renderItem={({item, key}) => <ArtistItem artist={item} />}
            />
          </View>
          <View>
            {this.state.results?.artists?.items?.length > 0 ? (
              <Text>Titres</Text>
            ) : null}
            <FlatList
              data={this.state.results?.tracks?.items}
              scrollEnabled={false}
              horizontal={false}
              renderItem={({item, key}) => <TrackItem track={item} />}
            />
          </View>
          <View style={{marginBottom: 110}}>
            {this.state.results?.artists?.items?.length > 0 ? (
              <Text>Albums</Text>
            ) : null}
            <FlatList
              data={this.state.results?.albums?.items}
              scrollEnabled={false}
              horizontal={false}
              renderItem={({item, key}) => <TrackItem track={item} />}
            />
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
});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(SearchScreen);
