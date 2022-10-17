//import liraries
import axios from 'axios';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
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
          transparent={false}
          visible={this.state.modalVisible}
          statusBarTranslucent={true}
          hardwareAccelerated={true}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TextInput
              style={{
                width: Dimensions.get('screen').width - 20,
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
          </View>
        </Modal>
        <FlatList
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={() => (
            <LinearGradient
              colors={['#15202B', '#15202B', 'transparent']}
              style={{elevation: 10}}>
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: true})}>
                <LinearGradient
                  colors={['#391a6c', '#b21f1f']}
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
                  colors={['#b21f1f', '#fdbb2d']}
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
