//import liraries
import axios from 'axios';
import {json} from 'express';
import React from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import ArtistItem from '../../../components/Artist/ArtistItem';

// create a component
class Artist extends React.Component {
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
    const response = promise.then(data => data.data);
    return response;
  };

  componentDidMount() {
    this._get_artist().then(data =>
      this.setState({artists: data.artists.items}),
    );
  }

  render() {
    return (
      <LinearGradient
        colors={['#B00D72', '#5523BF']}
        style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
        <FlatList
          data={this.state.artists}
          scrollEnabled={true}
          horizontal={false}
          numColumns={3}
          keyExtractor={item => item.id}
          renderItem={({item, key}) => <ArtistItem artist={item} />}
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
          contentContainerStyle={{alignItems: 'center'}}
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
    backgroundColor: '#2c3e50',
  },
});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(Artist);
