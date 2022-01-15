import axios from 'axios';
import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    setSearch(e);
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
      .then(data => setResults(data.data));
  };

  componentDidMount() {}

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <LinearGradient
          colors={['#B00D72', '#5523BF']}
          style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
          <TextInput
            onChangeText={this._search}
            placeholder={'Rechercher'}
            value={this.state.search}
          />
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
        </LinearGradient>
      </ScrollView>
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

export default connect()(SearchScreen);
