import React from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

class AlbumItem extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.push('Album', {
            album_id: this.props.album.id,
          });
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            maxWidth: Dimensions.get('screen').width / 2,
            margin: this.props.search ? 5 : 10,
          }}>
          <Image
            source={{uri: this.props.album?.images[1]?.url}}
            style={{
              width: Dimensions.get('screen').width / 2 - 20,
              height: Dimensions.get('screen').width / 2 - 20,
              borderRadius: 10,
            }}
          />
          <Text
            style={{fontWeight: 'bold', color: 'white'}}
            numberOfLines={1}
            textBreakStrategy={'balanced'}>
            {this.props.album?.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default AlbumItem;
