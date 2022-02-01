import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Dimensions, Image, Text, TouchableWithoutFeedback, View,} from 'react-native';

function AlbumItem({album, search = false}) {
	const navigation = useNavigation();

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				navigation.navigate('Album', {
					album_id: album.id,
				});
			}}>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'flex-start',
					maxWidth: Dimensions.get('screen').width / 2,
					margin: search ? 5 : 10,
				}}>
				<Image
					source={{uri: album?.images[1]?.url}}
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
					{album?.name}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

export default AlbumItem;
