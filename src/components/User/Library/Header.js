import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import {connect} from 'react-redux';
import Animated, {Extrapolate} from 'react-native-reanimated';
import axios from 'axios';

class SelfHeader extends React.PureComponent{

    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    render() {

        return (
            <>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute',
                    left: 0, right: 0, top: StatusBar.currentHeight, height: 50, paddingHorizontal: 10, zIndex: 99
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name={"arrow-left"} size={24} color={'white'} />
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
                            {this.props.user?.images[0] ? (
                                <Image
                                    source={{uri: "https://static.bimago.pl/mediacache/catalog/product/cache/4/2/117624/image/750x1120/7c0505584f03c89c005bad1e2b9708a6/117624_1.jpg"}}
                                    style={{height: 40, width: 40, borderRadius: 10}}
                                />
                            ) : null}
                            <Text style={{color: 'white', marginLeft: 10}}>Mes titres likés</Text>
                        </View>
                    </View>
                </View>
            </>
        );
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
