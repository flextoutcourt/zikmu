//import liraries
import axios from 'axios';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import PlaylistItem from '../../../components/Playlist/PlaylistItem';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('screen');

// create a component
class Playlists extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playlists: null,
      modalVisible: false,
      playlist_name: 'Ma super playlist',
      spotify_user_id: null,
    };
  }

  _get_playlists = (offset = 0) => {
    const promise = axios.get(
      `https://api.spotify.com/v1/me/playlists?offset=${offset}`,
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
    this._get_playlists().then(data => this.setState({playlists: data.items}));
    this._get_my_id();
  }

  //get my spotify id
  _get_my_id = () => {
    const promise = axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
    });
    return promise.then(data => this.setState({spotify_user_id: data.data.id}));
  };

  _create_playlist = () => {
    fetch(
      `https://api.spotify.com/v1/users/${this.state.spotify_user_id}/playlists`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.playlist_name,
          public: false,
        }),
      },
    )
      .then(response => response.json())
      .then(data => {
        this.setState({modalVisible: false});
        this.props.navigation.push('Playlist', {
          playlist_id: data.id,
        });
      })
      .catch(error => {
        Alert.alert('Erreur', error.message);
      });
  };

  render() {
    return (
      <LinearGradient
        colors={['#15202B', '#15202B']}
        style={({marginTop: -StatusBar.currentHeight}, styles.container)}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          hardwareAccelerated={true}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: Dimensions.get('screen').width,
              backgroundColor: '#7856FF',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              paddingVertical: 50,
            }}>
            <TouchableOpacity
              onPress={() => this.setState({modalVisible: false})}
              style={{position: 'absolute', top: 10, right: 10}}>
              <Icon name={'close'} size={24} color={'white'} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              Donnez un joli nom a la playlist
            </Text>
            <TextInput
              style={{
                width: Dimensions.get('screen').width - 40,
                marginHorizontal: 10,
                borderRadius: 10,
                backgroundColor: '#1E2732',
                padding: 10,
                elevation: 10,
                color: 'white',
              }}
              value={this.state.playlist_name}
              onSubmitEditing={val => this._create_playlist()}
              onChangeText={val => this.setState({playlist_name: val})}
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                width: Dimensions.get('screen').width - 40,
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: false})}>
                <Text style={{color: '#95a5a6', fontSize: 20}}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._create_playlist()}>
                <Text style={{color: 'white', fontSize: 20}}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <FlatList
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          refreshControl={
            <RefreshControl
              colors={['#7856FF', '#7856FF']}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({refreshing: true});
                this._get_playlists().then(data =>
                  this.setState({playlists: data.items, refreshing: false}),
                );
              }}
            />
          }
          ListHeaderComponent={() => (
            <LinearGradient
              colors={['#15202B', '#15202B', 'transparent']}
              style={{elevation: 10}}>
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: true})}>
                <LinearGradient
                  colors={['#1E2732', '#1E2732']}
                  useAngle={true}
                  angle={180}
                  style={{
                    flex: 1,
                    height: 50,
                    width: width - 10,
                    margin: 5,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#7856FF',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                    Ajouter une playlist
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('MyTracks');
                }}>
                <LinearGradient
                  colors={['#1E2732', '#1E2732']}
                  useAngle={true}
                  angle={180}
                  style={{
                    flex: 1,
                    height: 50,
                    width: width - 10,
                    margin: 5,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#7856FF'
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                    Mes titres likés ({this.props.store.liked?.liked?.total})
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          )}
          data={this.state.playlists}
          scrollEnabled={true}
          horizontal={false}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            this._get_playlists(this.state.playlists.length).then(data => {
              this.setState({
                playlists: [...this.state.playlists, ...data.items],
              });
            });
          }}
          renderItem={({item, key}) => <PlaylistItem playlist={item} />}
          contentContainerStyle={{paddingBottom: 120}}
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

export default connect(mapStateToProps)(Playlists);
