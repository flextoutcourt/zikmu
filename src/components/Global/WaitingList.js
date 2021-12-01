import React, {useState, useEffect, useContext } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReactReduxContext, connect } from 'react-redux'

class WaitingList extends React.Component {

    render(){
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: Dimensions.get('screen').width}}>
                <Text></Text>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(WaitingList)
