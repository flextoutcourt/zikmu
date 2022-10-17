import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';

class TrackInfos extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      test: null,
    };
  }

  render() {
    return (
      <View>
        <Text>Track infos menu</Text>
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(TrackInfos);
