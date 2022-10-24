import React, {PureComponent} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

class TransferPlayback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      device_menu: {
        big: false,
        top: new Animated.Value(Dimensions.get('screen').height),
        bottom: 0,
        left: 0,
        right: 0,
        height: new Animated.Value(0),
      },
    };
  }

  _deploy_devices_menu = () => {
    if (this.state.device_menu.big) {
      Animated.spring(this.state.device_menu.top, {
        toValue: Dimensions.get('screen').height,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.device_menu.height, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      this._get_available_devices();
      Animated.spring(this.state.device_menu.top, {
        toValue: Dimensions.get('screen').height / 2,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.state.device_menu.height, {
        toValue: Dimensions.get('screen').height / 2,
        useNativeDriver: false,
      }).start();
    }
    this.setState(prevState => ({
      ...prevState,
      device_menu: {
        ...prevState.device_menu,
        big: !this.state.device_menu.big,
      },
    }));
  };

  _get_available_devices = () => {
    axios
      .get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer ' + this.props.store.authentication.accessToken,
          'Content-Type': 'application/json',
        },
      })
      .then(data => data.data)
      .then(response => {
        let devices = this._check_current_device(response.devices);
        this.setState(prevState => ({
          ...prevState,
          devices: devices,
        }));
      });
  };

  _check_current_device = devices => {
    let to_return = {
      active: {},
      list: [],
    };
    devices.map(item => {
      if (item.is_active) {
        to_return.active = item;
      } else {
        to_return.list.push(item);
      }
    });
    return to_return;
  };

  _transfer_playback = async device_id => {
    let body = {
      devices_ids: [device_id],
    };
    await fetch('https://api.spotify.com/v1/me/player', {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }).finally(() => {
      this._get_available_devices();
    });
  };

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: this.state.device_menu.top,
          left: this.state.device_menu.left,
          right: this.state.device_menu.right,
          bottom: this.state.device_menu.bottom,
          height: this.state.device_menu.height,
          backgroundColor: '#7856FF',
          paddingTop: 10,
          flex: 1,
          borderRadius: 10,
          elevation: 10,
          shadowColor: '#000000',
        }}>
        <View
          style={{
            width: Dimensions.get('screen').width,
            height: 50,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            paddingHorizontal: 30,
          }}>
          <TouchableOpacity onPress={() => this._deploy_devices_menu()}>
            <Icon name={'x'} size={24} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, padding: 30}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Icon name={'music'} size={48} color={'white'} />
            <View style={{marginLeft: 20}}>
              <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>
                Écoute en cours sur :
              </Text>
              <Text style={{color: 'white', fontSize: 18}}>
                {this.state.devices?.active?.name}
              </Text>
            </View>
          </View>
          <Text style={{fontSize: 16, color: 'white', marginVertical: 10}}>
            Séléctionnez un appareil
          </Text>
          <FlatList
            data={this.state.devices?.list}
            renderItem={({item, key}) => (
              <TouchableOpacity
                onPress={() => this._transfer_playback(item.id)}
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name={this._display_device_icon(item.type)}
                  size={48}
                  color={'white'}
                />
                <Text style={{fontSize: 16, marginLeft: 25}}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Animated.View>
    );
  }
}

const mapStateToProps = store => {
  return {
    store: store,
  };
};

export default connect(mapStateToProps)(TransferPlayback);
