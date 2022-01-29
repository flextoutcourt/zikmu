import axios from 'axios';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {interpolate, Extrapolate} from 'react-native-reanimated';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import Albums from '../../components/Artist/Albums';
import Header from '../../components/Artist/Header';
import RelatedArtists from '../../components/Artist/RelatedArtists';
import TopTracks from '../../components/Artist/TopTracks';
import SubHeader from "../../components/Artist/SubHeader";
import YourLikes from '../../components/Artist/YourLikes';

class ArtistScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      scrollY: new Animated.Value(0),
    };
  }
  _get_artist = () => {
    const promise = axios.get(
      `https://api.spotify.com/v1/artists/${this.props.route.params.artist_id}`,
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
        headerRight: () => (
            <FontAwesome5Icon name="heart" size={24} color={'red'} />
        ),
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
      outputRange: [Dimensions.get('screen').width, Dimensions.get('screen').width],
      extrapolate: Extrapolate.CLAMP
    });

    const mt = this.state.scrollY.interpolate({
      inputRange: [0, Dimensions.get('window').height * 4],
      outputRange: [Dimensions.get('screen').width + 15, 0],
      extrapolate: Extrapolate.CLAMP
    });

    const borderRadius = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [0, 350],
      extrapolate: Extrapolate.CLAMP
    });

    const transform = [{scale}];

    return (
      <LinearGradient
        colors={['#B00D72', '#5523BF']}
        style={({marginTop: - 2.5 * StatusBar.currentHeight}, styles.container)}>
        <Header
          y={this.state.scrollY}
          artist={this.state.artist}
          {...this.props}
        />
        <SubHeader y={this.state.scrollY} {...this.props} artist={this.state.artist}/>
        <Animated.ScrollView
          style={{
            flex: 1,
            width: Dimensions.get('screen').width,
            marginTop: -2.5 * StatusBar.currentHeight,
            zIndex: 9
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {listener: '', useNativeDriver: true},
          )}>
          {this.state.artist != null ? (
            <>
              <Animated.View
                style={{
                  alignItems: 'center',
                  position: 'relative'
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
                  marginTop: mt,
                }}>
                {this.state.artist?.name}
              </Animated.Text>
              <Animated.View style={{
                marginTop: 0,
              }}>
                <YourLikes artist={this.state.artist} />
                <TopTracks artist={this.state.artist} isOne={true} />
                <Albums artist={this.state.artist} {...this.props} />
                <RelatedArtists artist={this.state.artist} {...this.props}/>
              </Animated.View>

            </>
          ) : (
            <Text>test</Text>
          )}
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
    backgroundColor: '#2c3e50',
  },
});

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(ArtistScreen);
