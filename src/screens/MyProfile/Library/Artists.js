//import liraries
import axios from 'axios';
import React from 'react';
import {Dimensions, FlatList, RefreshControl, StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import ArtistAlt from '../../../components/Artist/ArtistAlt';

// create a component
class Artist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
    };
  }

  _get_artist = (offset = 0) => {
    console.log(offset);
    const promise = axios.get(
      `https://api.spotify.com/v1/me/following?type=artist&after=${offset}&limit=20`,
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
    this._get_artist().then(data =>
      this.setState({artists: data.artists.items}),
    );
  }

  render() {
    return (
      <LinearGradient
        colors={['#15202B', '#15202B']}
        style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
        <FlatList
          data={this.state.artists}
          scrollEnabled={true}
          horizontal={false}
          numColumns={3}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              colors={['#7856FF', '#7856FF']}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({refreshing: true});
                this._get_artist().then(data =>
                  this.setState({artists: data.artists.items, refreshing: false}),
                );
              }}
            />
          }
          renderItem={({item, key}) => (
            <ArtistAlt artist={item} {...this.props} />
          )}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            this._get_artist(
              this.state.artists[this.state.artists.length - 1].id,
            ).then(data => {
              // this.state.artists.push(data.artists.items);
              // console.log(this.state.artists);
              this.setState({
                artists: [...this.state.artists, ...data.artists.items],
              });
            });
            // this._get_artist(this.state.artists[this.state.artists.length - 1].id).then(data => console.log(data.artists.items))
          }}
          contentContainerStyle={{
            alignItems: 'center',
            marginTop: 20,
            paddingBottom: 140,
          }}
          style={{width: Dimensions.get('screen').width, flex: 1}}
        />
      </LinearGradient>
    );
  }
}

// define your styles
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

export default connect(mapStateToProps)(Artist);
