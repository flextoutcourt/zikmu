import React from 'react';
import {View, TextInput, Dimensions} from 'react-native';

export default class SearchMenu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <TextInput
          onChangeText={this.props.onChangeText}
          placeholder={'Rechercher'}
          placeholderTextColor={'white'}
          value={this.props.search}
          style={{
            width: Dimensions.get('screen').width - 20,
            marginHorizontal: 10,
            borderRadius: 10,
            backgroundColor: '#1E2732',
            padding: 10,
            elevation: 10,
            color: 'white',
          }}
        />
      </View>
    );
  }
}
