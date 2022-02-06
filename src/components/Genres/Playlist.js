import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Dimensions, Image, Text, TouchableWithoutFeedback, View,} from 'react-native';

function AlbumItem({playlist}) {
	const navigation = useNavigation();

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				navigation.navigate('Playlist', {
					playlist_id: playlist.id,
				});
			}}>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'flex-start',
					maxWidth: Dimensions.get('screen').width / 2,
					margin: 10,
				}}>
				<Image
					source={{uri: playlist?.images[0]?.url}}
					style={{
						width: Dimensions.get('screen').width / 2 - 20,
						height: Dimensions.get('screen').width / 2 - 20,
						borderRadius: 10,
					}}
				/>
				<Text
					style={{fontWeight: 'bold', color: 'white'}}
					numberOfLines={1}
					textBreakStrategy={'balanced'}>
					{playlist?.name}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

export default AlbumItem;
