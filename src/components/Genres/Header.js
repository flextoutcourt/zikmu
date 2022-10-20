import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {Extrapolate} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const opacity = this.props.y.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 1],
      extrapolate: Extrapolate.CLAMP,
    });

    const background = this.props.y.interpolate({
      inputRange: [0, 100],
      outputRange: [0.5, 0.5],
      extrapolate: Extrapolate.CLAMP,
    });

    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: Animated.color(0, 0, 0, background),
          marginTop: StatusBar.currentHeight,
          width: Dimensions.get('screen').width,
          padding: 10,
          zIndex: 99,
        }}>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Icon
              name="arrow-left"
              color={'white'}
              size={24}
              style={{marginRight: 15}}
            />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={{
            opacity: opacity,
            flex: 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 3}}>
            {this.props.genre?.icons[0] ? (
              <Image
                source={{uri: this.props.genre?.icons[0]?.url}}
                style={{height: 40, width: 40, borderRadius: 10}}
              />
            ) : null}
            <Text
              numberOfLines={1}
              style={{color: 'white', marginLeft: 10, fontWeight: 'bold'}}>
              {this.props.genre?.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => alert('liked')}>
              <Icon name="heart" size={24} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => alert('liked')}
              style={{marginLeft: 15}}>
              <Icon name="more-vertical" size={24} color={'white'} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({});

export default Header;
