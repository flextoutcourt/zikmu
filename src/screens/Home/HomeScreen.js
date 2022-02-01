import React, {Component} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<LinearGradient
				colors={['#B00D72', '#5523BF']}
				style={{paddingTop: -StatusBar.currentHeight, ...styles.container}}>
				{/* <View style={{flex: 1, marginTop: StatusBar.currentHeight}}> */}
				{/* <RecentComponent />
                    <GenreComponent />
                </View> */}
			</LinearGradient>
		);
	}
}

const mapStateToProps = store => {
	return {
		store: store,
	};
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2c3e50',
	},
});

export default connect(mapStateToProps)(HomeScreen);
