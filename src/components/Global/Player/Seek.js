import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

import Slider from 'react-native-slider';

function pad(n, width, z = 0) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = position => [
	pad(Math.floor(position / 60), 2),
	pad(Math.floor(position % 60), 2),
];

export default function SeekBar({
	                                trackLength,
	                                currentPosition,
	                                onSeek,
	                                onSlidingStart,
                                }) {
	const elapsed = minutesAndSeconds(currentPosition);
	const remaining = minutesAndSeconds(trackLength - currentPosition);
	return (
		<View style={{flex: 1}}>
			<View style={{flexDirection: 'row'}}>
				<Text style={styles.text}>{elapsed[0] + ':' + elapsed[1]}</Text>
				<View style={{flex: 1}}/>
				<Text style={[styles.text, {width: 40}]}>
					{trackLength > 1 && '-' + remaining[0] + ':' + remaining[1]}
				</Text>
			</View>
			<Slider
				maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
				value={currentPosition}
				onSlidingStart={onSlidingStart}
				onSlidingComplete={onSeek}
				style={styles.slider}
				minimumTrackTintColor="#fff"
				maximumTrackTintColor="rgba(255, 255, 255, 0.50)"
				thumbStyle={styles.thumb}
				trackStyle={styles.track}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	slider: {
		marginTop: -12,
	},
	container: {
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 16,
	},
	track: {
		height: 2,
		borderRadius: 1,
	},
	thumb: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: 'white',
	},
	text: {
		color: 'white',
		fontSize: 12,
		textAlign: 'center',
	},
});
