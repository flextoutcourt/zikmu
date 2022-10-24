import React, {PureComponent} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux';
import SelfHeader from '../../components/User/SelfHeader';
import axios from 'axios';

class SelfScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  _get_user = () => {
    let url = 'https://api.spotify.com/v1/me';
    const promise = axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
        'Content-Type': 'application/json',
      },
    });
    return promise.then(data => data.data);
  };

  componentDidMount() {
    this._get_user().then(json => this.setState({user: json}));
  }

  render() {
    return (
      <LinearGradient
        colors={['#15202B', '#15202B']}
        style={{
          marginTop: 0,
          ...styles.container,
        }}>
        <SelfHeader user={this.state.user} {...this.props}/>
        <ScrollView style={{paddingTop: 2 * StatusBar.currentHeight}}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push('User', {
                user_id: this.state.user?.id,
              })
            }
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{height: 100, width: 100, borderRadius: 100}}>
                <Image
                  source={{uri: this.state.user?.images[0]?.url}}
                  style={{...StyleSheet.absoluteFill, borderRadius: 100}}
                />
              </View>
              <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {this.state.user?.display_name}
                </Text>
                <Text>Voir le profil</Text>
              </View>
            </View>
            <View style={{marginLeft: 20}}>
              <Icon
                name={'chevron-forward'}
                solid={true}
                size={24}
                color={'white'}
              />
            </View>
          </TouchableOpacity>
          <View style={{padding: 10}}>
            <Text style={{...styles.title}}>Compte</Text>
          </View>
          {/*    Profil utilisateur*/}
          {/*    Differents settings */}
        </ScrollView>
      </LinearGradient>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default connect(mapStateToProps)(SelfScreen);
