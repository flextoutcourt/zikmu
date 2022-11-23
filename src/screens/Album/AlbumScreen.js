import axios from 'axios';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Animated, {Extrapolate} from 'react-native-reanimated';
import TrackItem from '../../components/Track/TrackItem';
import Header from '../../components/Album/Header';
import moment from 'moment';
import ArtistItem from '../../components/Artist/ArtistItem';
import SpotifyWebApi from 'spotify-web-api-node';
import AlbumItem from '../../components/Album/AlbumItem';

const SpotifyApi = new SpotifyWebApi();

class AlbumScreen extends React.Component {
  constructor(props) {
    super(props);
    SpotifyApi.setAccessToken(this.props.store.authentication.accessToken);
    this.state = {
      album: null,
      disks: null,
      test: null,
      scrollY: new Animated.Value(0),
      recommendations: null,
      liked: false,
    };
  }

  _get_album = () => {
    const promise = SpotifyApi.getAlbum(this.props.route.params.album_id);
    return promise.then(data => data.body);
  };

  _group_by_key = array => {
    let groups = [];
    array.map((item, key) => {
      if (groups[item.disc_number]) {
        groups[item.disc_number].data.push(item);
      } else {
        groups[item.disc_number] = {
          title: 'Disque ' + item.disc_number,
          data: [],
        };
        groups[item.disc_number].data.push(item);
      }
    });
    return groups;
  };

  _get_related_albums = json => {
    SpotifyApi.getArtistAlbums([json.artists[0]?.id], {
      include_groups: 'album',
    }).then(data => {
      this.setState({recommendations: data.body.items});
    });
  };

  componentDidMount() {
    this._check_liked();
    const opacity = this.state.scrollY.interpolate({
      inputRange: [250, 325],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    });
    this._get_album().then(json => {
      this.setState({album: json});
      this._get_related_albums(json);
      console.log(this._group_by_key(json.tracks.items).splice(1));
      this.setState({
        disks: this._group_by_key(json.tracks.items, 'disc_number').splice(1),
      });
      this.setState({
        test: this._group_by_key(json.tracks.items, 'disc_number').splice(1),
      });

      this.props.navigation.setOptions({
        headerTransparent: true,
        headerTintColor: 'white',
        headerTitle: () => (
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: -15,
              overflow: 'hidden',
              opacity: this.state.scrollY.interpolate({
                inputRange: [0, 325],
                outputRange: [0, 1],
                extrapolate: Extrapolate.CLAMP,
              }),
            }}>
            {json?.images[0] ? (
              <Image
                source={{uri: json?.images[0]?.url}}
                style={{height: 40, width: 40, borderRadius: 10}}
              />
            ) : null}
            <Text style={{color: 'white', marginLeft: 10, fontWeight: 'bold'}}>
              {json?.name}
            </Text>
          </Animated.View>
        ),
        headerRight: () => (
          <View>
            <Icon name="heart" size={24} color={'white'} solid={true} />
          </View>
        ),
      });
      super.forceUpdate();
    });
  }

  _get_full_duration = () => {
    let duration = 0;
    this.state.album.tracks.items.map((item, key) => {
      duration += item.duration_ms;
    });
    let hours = moment.duration(duration).hours();
    return (
      (hours > 0 ? hours + ' h ' : '') +
      moment.duration(duration).minutes() +
      ' min ' +
      moment.duration(duration).seconds() +
      ' s '
    );
  };

  _on_like = () => {
    this.state.liked
      ? SpotifyApi.removeFromMySavedAlbums([this.state.album.id]).then(() => {
          this.setState({liked: false});
        })
      : SpotifyApi.addToMySavedAlbums([this.state.album.id]).then(data => {
          this.setState({liked: true});
        });
  };

  _check_liked = () => {
    SpotifyApi.containsMySavedAlbums([this.props.route.params.album_id]).then(
      data => {
        this.setState({liked: data.body[0]});
      },
    );
  };

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
      outputRange: [Dimensions.get('screen').width + 50, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    const borderRadius = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [0, 350],
      extrapolate: Extrapolate.CLAMP,
    });

    const transform = [{scale}];

    const ml = this.state.scrollY.interpolate({
      inputRange: [0, 125],
      outputRange: [StatusBar.currentHeight, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    return (
      <LinearGradient
        colors={['#15202B', '#15202B']}
        style={({marginTop: 0}, styles.container)}>
        <Header
          y={this.state.scrollY}
          album={this.state.album}
          onLike={this._on_like}
          liked={this.state.liked}
          {...this.props}
        />
        <Animated.ScrollView
          style={{marginTop: -2.5 * StatusBar.currentHeight, zIndex: 98}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {listener: '', useNativeDriver: true},
          )}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={400}
          overScrollMode={'always'}>
          <Animated.View style={{marginTop: mt, paddingBottom: 120}}>
            {this.state.disks && this.state.test ? (
              <SectionList
                scrollEnabled={false}
                sections={this.state.disks}
                keyExtractor={({item, index}) => item * index}
                style={{backgroundColor: '#15202B'}}
                renderItem={({item, section}) => (
                  <TrackItem
                    track={item}
                    album={this.state.album}
                    disks={this.state.test}
                    type={'album'}
                  />
                )}
                ListFooterComponent={() => (
                  <View style={{padding: 15}}>
                    <View>
                      <Text style={{color: 'white'}}>
                        {moment(this.state.album?.release_date).format(
                          'DD MMMM YYYY',
                        )}
                      </Text>
                      <Text style={{color: 'white', marginBottom: 10}}>
                        {this.state.album?.total_tracks} titres -{' '}
                        {this._get_full_duration()}
                      </Text>
                      <FlatList
                        data={this.state.album?.artists}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={() => (
                          <View style={{height: 10, width: 10}} />
                        )}
                        renderItem={({item}) => (
                          <>
                            <View style={{height: 10, flex: 1}} />
                            <ArtistItem artist_id={item?.id} {...this.props} />
                            <View style={{height: 10, flex: 1}} />
                          </>
                        )}
                      />
                    </View>
                    <FlatList
                      data={this.state.album?.copyrights}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => {
                        return (
                          <View
                            style={{flexDirection: 'row', marginVertical: 5}}>
                            <Icon
                              name={'information-outline'}
                              size={18}
                              color="white"
                            />
                            <Text style={{marginLeft: 10, color: 'white'}}>
                              {item?.text}
                            </Text>
                          </View>
                        );
                      }}
                    />
                    <Text style={{color: 'white', marginTop: 10}}>
                      {this.state.album?.copyrights[0].text}
                    </Text>
                  </View>
                )}
                renderSectionHeader={({section: {title}}) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      marginLeft: 5,
                    }}>
                    <Icon name="disc-outline" size={24} color={'white'} />
                    <Text
                      style={{
                        fontSize: 18,
                        marginLeft: 10,
                        color: 'white',
                        marginVertical: 15,
                      }}>
                      {title}
                    </Text>
                  </View>
                )}
              />
            ) : null}
            {this.state.recommendations?.length > 1 ? (
              <>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    paddingHorizontal: 10,
                    textAlign: 'left',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'white',
                      flex: 1,
                      justifyContent: 'flex-start',
                    }}>
                    Vous aimerez aussi
                  </Text>
                </View>
                <FlatList
                  data={this.state.recommendations}
                  horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, key}) =>
                    this.state.album?.id !== item?.id ? (
                      <AlbumItem album={item} {...this.props} />
                    ) : null
                  }
                />
              </>
            ) : null}
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

export default connect(mapStateToProps)(AlbumScreen);
