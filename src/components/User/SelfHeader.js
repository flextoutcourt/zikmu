import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {connect} from 'react-redux';

class SelfHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          position: 'absolute',
          left: 0,
          right: 0,
          top: StatusBar.currentHeight,
          height: 50,
          paddingHorizontal: 10,
          zIndex: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name={'arrow-left'} size={24} color={'white'} />
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              flex: 1,
              transform: [{translateX: -12}],
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Préférences
          </Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(mapStateToProps)(SelfHeader);
