import React from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import ReleaseItem from './ReleaseItem';
import axios from 'axios';

class ReleaseComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      releases: null,
    };
  }

  _get_last_releases = () => {
    console.log('genres');
    const promise = axios.get(
      'https://api.spotify.com/v1/browse/new-releases',
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
    this._get_last_releases().then(json =>
      this.setState({releases: json.albums.items}),
    );
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.releases}
          horizontal={true}
          renderItem={({item, key}) => (
            <ReleaseItem release={item} {...this.props} />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(ReleaseComponent);
