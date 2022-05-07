import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import Animated, {Extrapolate} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

class Header extends React.PureComponent {
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
			outputRange: [1.3, 1, 0.9],
			extrapolate: Extrapolate.CLAMP
		});
		const maskScale = this.props.y.interpolate({
			inputRange: [-Dimensions.get('screen').width, 0, Dimensions.get('screen').width],
			outputRange: [1.3, 1, 1.1],
			extrapolate: Extrapolate.CLAMP
		});

		const transform = [{scale}];

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
							{this.props.artist?.images[0] ? (
								<Image
									source={{uri: this.props.artist?.images[0]?.url}}
									style={{height: 40, width: 40, borderRadius: 10}}
								/>
							) : null}
							<Text style={{color: 'white', marginLeft: 10}}>{this.props.artist?.name}</Text>
						</View>
					</View>
				</View>
				<Animated.Image
					source={{uri: this.props.artist?.images[0]?.url}}
					style={{
						width: Dimensions.get('screen').width - StatusBar.currentHeight * 3,
						height: Dimensions.get('screen').width - StatusBar.currentHeight * 3,
						margin: StatusBar.currentHeight * 1.5,
						position: 'absolute',
						borderRadius: 10,
						top: StatusBar.currentHeight,
						left: 0,
						right: 0,
						transform: transform,
					}}
				/>
				<Animated.View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: Dimensions.get('screen').width * 2,
						marginTop: mt,
						opacity: maskOpacity,
						transform: [{scale: maskScale}]
					}}
				>
					<LinearGradient
						colors={['rgba(142,68,173,0)','rgba(142,68,173,0.5)', 'rgba(52, 73, 94,1.0)', 'rgba(52, 73, 94,1.0)']}
						style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').width * 1.2}}>
					</LinearGradient>
				</Animated.View>
			</>
		);
	}
}

const styles = StyleSheet.create({});

export default Header;
