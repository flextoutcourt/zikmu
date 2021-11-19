import React, {useState, useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { ReactReduxContext, connect } from 'react-redux'

function WaitingList() {

    const { store } = useContext(ReactReduxContext);

    return (
        <View>
            <Text></Text>
        </View>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(WaitingList)
