import React, {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

class ShareMenu extends PureComponent{

    constructor(props){
        super(props);
        this.state = {
            test: null
        }
    }

    render(){
        return(
            <View>
                <Text>Share menu</Text>
            </View>
        )
    }

}

const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(ShareMenu);
