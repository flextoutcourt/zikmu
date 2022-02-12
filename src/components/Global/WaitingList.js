import React, {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

class WaitingList extends PureComponent{

	constructor(props){
		super(props);
		this.state = {
			test: null
		}
	}

	render(){
		return(
			<View>
				<Text>Waiting List menu</Text>
			</View>
		)
	}

}

const mapStateToProps = store => {
	return {
		store: store
	}
}

export default connect(mapStateToProps)(WaitingList);
