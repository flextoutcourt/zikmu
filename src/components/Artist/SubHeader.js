import React, {Component} from 'react';
import {Dimensions, StyleSheet,} from 'react-native';
import Animated, {Extrapolate} from 'react-native-reanimated';
import LinearGradient from "react-native-linear-gradient";

class SubHeader extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}

	render() {
		const opacity = this.props.y.interpolate({
			inputRange: [125, 200],
			outputRange: [0, 1],
			extrapolate: Extrapolate.CLAMP,
		});

		const background = this.props.y.interpolate({
			inputRange: [0, 125, 200],
			outputRange: [0, 0, 0.5],
			extrapolate: Extrapolate.CLAMP,
		});

		const mt = this.props.y.interpolate({
			inputRange: [0, Dimensions.get('window').height],
			outputRange: [0, -Dimensions.get('window').height - 140],
			extrapolate: Extrapolate.CLAMP
		})

		const maskOpacity = this.props.y.interpolate({
			inputRange: [0, Dimensions.get('screen').width],
			outputRange: [0.3, 1],
			extrapolate: Extrapolate.CLAMP
		});

		const scale = this.props.y.interpolate({
			inputRange: [-Dimensions.get('screen').width, 0, Dimensions.get('screen').width],
			outputRange: [1.3, 1, 1.3],
			extrapolate: Extrapolate.CLAMP
		});

		const transform = [{scale}];

		return (
			<>
				<Animated.Image
					source={{uri: this.props.artist?.images[0]?.url}}
					style={{
						width: Dimensions.get('screen').width,
						height: Dimensions.get('screen').width,
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						marginTop: mt,
						transform: transform,
					}}
				/>
				<Animated.View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: Dimensions.get('screen').width,
						marginTop: mt,
						opacity: maskOpacity,
						transform: transform
					}}
				>
					<LinearGradient
						colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)']}
						style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').width}}/>
				</Animated.View>
			</>
		);
	}
}

const styles = StyleSheet.create({});

export default SubHeader;
