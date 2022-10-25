import axios from 'axios';
import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {Extrapolate} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Albums from '../../components/Artist/Albums';
import Header from '../../components/Artist/Header';
import RelatedArtists from '../../components/Artist/RelatedArtists';
import TopTracks from '../../components/Artist/TopTracks';
import YourLikes from '../../components/Artist/YourLikes';
import SpotifyWebApi from 'spotify-web-api-node';

const SpotifyApi = new SpotifyWebApi();

class ArtistScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    SpotifyApi.setAccessToken(this.props.store.authentication.accessToken);
    this.state = {
      artist: null,
      scrollY: new Animated.Value(0),
    };
  }

  _get_artist = () => {
    const promise = SpotifyApi.getArtist(this.props.route.params.artist_id);
    return promise.then(data => data.body);
  };

  componentDidMount() {
    this._get_artist().then(data => {
      this.setState({artist: data});
      this.props.navigation.setOptions({
        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: -15,
            }}>
            {data?.images[0] ? (
              <Image
                source={{uri: data?.images[0]?.url}}
                style={{height: 48, width: 48, borderRadius: 10}}
              />
            ) : null}
            <Text style={{color: 'black', marginLeft: 10, fontWeight: 'bold'}}>
              {data?.name}
            </Text>
          </View>
        ),
        headerRight: () => <Icon name="heart" size={24} color={'red'} />,
      });
    });
  }

  render() {
    const scale = this.state.scrollY.interpolate({
      inputRange: [-Dimensions.get('screen').height, 0, 125],
      outputRange: [2, 1, 0.5],
      extrapolateRight: Extrapolate.CLAMP,
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    const mb = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [10, -75],
      extrapolate: Extrapolate.CLAMP,
    });

    const br = this.state.scrollY.interpolate({
      inputRange: [0, 10],
      outputRange: [0, 10],
      extrapolate: Extrapolate.CLAMP,
    });

    const height = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [
        Dimensions.get('screen').width,
        Dimensions.get('screen').width,
      ],
      extrapolate: Extrapolate.CLAMP,
    });

    const mt = this.state.scrollY.interpolate({
      inputRange: [0, Dimensions.get('window').height * 10],
      outputRange: [Dimensions.get('screen').width - 20, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    const borderRadius = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [0, 350],
      extrapolate: Extrapolate.CLAMP,
    });

    const transform = [{scale}];

    return (
      <LinearGradient
        colors={['#15202B', '#15202B']}
        style={({marginTop: -2.5 * StatusBar.currentHeight}, styles.container)}>
        <Header
          y={this.state.scrollY}
          artist={this.state.artist}
          {...this.props}
        />
        {/*<SubHeader y={this.state.scrollY} {...this.props} artist={this.state.artist}/>*/}
        <Animated.ScrollView
          style={{zIndex: 98}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {listener: '', useNativeDriver: true},
          )}>
          <Animated.View style={{marginTop: mt, backgroundColor: '#15202B'}}>
            {this.state.artist != null ? (
              <>
                <Animated.View
                  style={{
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  {/*<Animated.Image*/}
                  {/*  source={{uri: this.state.artist?.images[0]?.url}}*/}
                  {/*  style={{*/}
                  {/*    width: Dimensions.get('screen').width,*/}
                  {/*    height:Dimensions.get('screen').width,*/}
                  {/*    position: 'absolute',*/}
                  {/*    top: 0,*/}
                  {/*    left: 0,*/}
                  {/*    right: 0,*/}
                  {/*  }}*/}
                  {/*/>*/}
                </Animated.View>
                <Animated.Text
                  style={{
                    fontSize: 36,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  {this.state.artist?.name}
                </Animated.Text>
                <Animated.View
                  style={{
                    marginTop: 0,
                  }}>
                  <YourLikes artist={this.state.artist} initialLikes={[]} />
                  <TopTracks artist={this.state.artist} />
                  <Albums {...this.props} artist={this.state.artist} />
                  <RelatedArtists {...this.props} artist={this.state.artist} />
                </Animated.View>
              </>
            ) : (
              <Text>test</Text>
            )}
          </Animated.View>
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

export default connect(mapStateToProps)(ArtistScreen);
