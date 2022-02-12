import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import {connect} from 'react-redux';
import axios from 'axios';

class SelfHeader extends React.PureComponent{

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount(){

    }

    render(){
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute',
                left: 0, right: 0, top: StatusBar.currentHeight, height: 50, paddingHorizontal: 10, zIndex: 10
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name={"arrow-left"} size={24} color={'white'} />
                    </TouchableOpacity>
                    <Text style={{color: 'white', marginLeft: 10}}>Votre profil</Text>
                </View>
            </View>
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

export default connect(mapStateToProps)(SelfHeader);
