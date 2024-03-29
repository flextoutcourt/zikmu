import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Vibration} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import likedSongHandler from '../../utils/likedSongHandler';
import {refreshLiked, setLiked} from '../../redux/features/liked/likedSlice';

class Liked extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
    };
  }

  _like = track_id => {
    Vibration.vibrate(10);
    if (this.state.liked === false) {
      fetch(`https://api.spotify.com/v1/me/tracks?ids=${track_id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          this.setState({
            liked: true,
          });
        })
        .catch(e => alert(e));
    } else {
      //délike
      this._unlike(track_id);
    }
  };

  _unlike = track_id => {
    fetch(`https://api.spotify.com/v1/me/tracks?ids=${track_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        this.setState({
          liked: false,
        });
      })
      .catch(e => alert(JSON.stringify(e)));
  };

  componentDidMount() {}

  render() {
    return (
      <TouchableOpacity onPress={this.props.onLike}>
        <Icon
          name={this.props.liked ? 'heart' : 'heart-outline'}
          size={this.props.iconSize ?? 24}
          color={this.props.liked ? '#c0392b' : 'white'}
        />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

const mapDispatchToProps = {
  setLiked,
  refreshLiked,
};

export default connect(mapStateToProps)(Liked);
