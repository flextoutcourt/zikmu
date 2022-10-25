import React from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {connect} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/Ionicons';
import SpotifyWebApi from 'spotify-web-api-node';

const SpotifyApi = new SpotifyWebApi();

class YourLikes extends React.PureComponent {
  constructor(props) {
    super(props);
    SpotifyApi.setAccessToken(this.props.store.authentication.accessToken);
    this.state = {
      artist_tracks: [],
      likes: 0,
    };
  }

  componentDidMount() {
    this._get_albums();
  }

  componentWillUnmount() {
    this.setState({likes: 0});
  }

  _get_artist_albums = (offset = 0, limit = 50) => {
    const promise = SpotifyApi.getArtistAlbums(this.props.artist?.id, {
      limit: limit,
      offset: offset,
      include_groups: 'album,single,compilation,appears_on',
    });
    return promise.then(data => data.body);
  };

  _get_albums = () => {
    this._get_artist_albums()
      .then(data => {
        if (data.next !== null) {
          this._get_artist_albums(data.limit, 50).then(data => {
            this.setState({
              artist_albums: [[...this.state.artist_albums, ...data.items]],
            });
            this._get_artist_tracks(data.items);
          });
        } else {
          this.setState({artist_albums: [data.items]});
        }
        this._get_artist_tracks(data.items);
      })
      .catch(err => {
        console.log(err);
      });
  };

  _get_artist_tracks = (albums, appendable = false) => {
    albums.map(album => {
      SpotifyApi.getAlbumTracks(album.id, {limit: 50, offset: 0})
        .then(data => {
          this.state.artist_tracks.push(data.body.items);
        })
        .catch(err => {
          console.log(err);
        });
    });
    setTimeout(() => {
      this._get_likes();
    }, 200);
  };

  _format_tracks = t => {
    console.log(t[0]);
    let formatted_tracks = [];

    t.map(item => {
      item.map(track => {
        formatted_tracks.push(track.id);
      });
    });

    return formatted_tracks;
  };

  _get_likes = () => {
    let a_tracks = this._format_tracks(this.state.artist_tracks);

    let chunks = [];
    let i = 0;
    let n = 50;

    while (i < a_tracks.length) {
      chunks.push(a_tracks.slice(i, (i += n)));
    }

    console.log(chunks);

    let likes = 0;
    chunks.map((chunk, index) => {
      SpotifyApi.containsMySavedTracks(chunk)
        .then(data => {
          console.log(data.body);
          data.body.map((item, key) => {
            if (item === true) {
              likes++;
            }
          });
          this.setState({likes: likes});
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  render() {
    return this.state.likes > 0 ? (
      <View
        style={{
          flex: 1,
          width: Dimensions.get('screen').width,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{width: 48, height: 48, position: 'relative'}}>
          <Image
            source={{uri: this.props.artist?.images[0]?.url}}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 100,
              elevation: 5,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: '-50%',
              bottom: '-50%',
              height: 18,
              width: 18,
              backgroundColor: 'red',
              transform: [{translateX: -26}, {translateY: -20}],
              borderRadius: 100,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 10,
            }}>
            <FontAwesome name="heart" size={10} color="white" />
          </View>
        </View>
        <View style={{marginLeft: 20}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>
            Titres likés
          </Text>
          <Text style={{color: 'white'}}>
            {this.state.likes} titres de {this.props.artist?.name}
          </Text>
        </View>
      </View>
    ) : null;
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(YourLikes);
