import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import {connect} from 'react-redux';
import SelfHeader from '../../components/User/SelfHeader';
import axios from 'axios';

class SelfScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    _get_user = () => {
        let url = `https://api.spotify.com/v1/me`;
        const promise = axios.get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.store.authentication.accessToken,
                'Content-Type': 'application/json',
            },
        });
        return promise.then(data => data.data);
    }

    componentDidMount(){
        this._get_user().then(json => this.setState({user: json}));
    }

    render(){
        return(
            <LinearGradient
                colors={['#8e44ad', '#2f3640']}
                style={{
                    marginTop: 0,
                    ...styles.container,
                }}>
                <SelfHeader {...this.props} user={this.state.user}/>
                <ScrollView style={{paddingTop: 2 * StatusBar.currentHeight}}>
                    <TouchableOpacity onPress={() => this.props.navigation.push('User', {
                        user_id: this.state.user?.id
                    })} style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{height: 100, width: 100, borderRadius: 100}}>
                                <Image source={{uri: 'https://picsum.photos/100'}} style={{...StyleSheet.absoluteFill, borderRadius: 100}} />
                            </View>
                            <Text style={{fontSize: 18, color: 'white', fontWeight: "bold", marginLeft: 10}}>{this.state.user?.display_name}</Text>
                        </View>
                        <View style={{marginLeft: 20}}>
                            <FontAwesome5Icon name={'chevron-right'} solid={true} size={24} color={'white'} />
                        </View>
                    </TouchableOpacity>
                {/*    Profil utilisateur*/}
                {/*    Differents settings */}
                </ScrollView>
            </LinearGradient>
        )
    }

}

const mapStateToProps = store => {
    return {
        store: store
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default connect(mapStateToProps)(SelfScreen);
