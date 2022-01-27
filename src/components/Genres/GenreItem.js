import React from 'react';
import {Dimensions, Image, Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

class GenreItem extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {

	}

	render() {
		return (
			<View style={{marginHorizontal: 10}}>
				<Image source={{uri: this.props.genre.item.icons[0].url}} style={styles.image}/>
				<Text style={{textAlign: 'center'}}>{this.props.genre?.item?.name}</Text>
			</View>
		);
	}
}

const margin = 10;
const numItems = 2;

const styles = StyleSheet.create({
	image: {
		height: (Dimensions.get('screen').width - margin * numItems * 2) / numItems,
		width: (Dimensions.get('screen').width - margin * numItems * 2) / numItems,
		borderRadius: 10,
		elevation: 10
	}
})

const mapStateToProps = store => {
	return {
		store: store,
	};
};

export default connect(mapStateToProps)(GenreItem);
