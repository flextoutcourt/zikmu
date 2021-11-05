import React, {useState, useEffect} from 'react';
import {FlatList, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View, Image, ScrollView, ListView} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {

  const [tracks, setTracks] = useState();

  const _get_tracks = (offset = 0) => {
    fetch(`https://api.spotify.com/v1/me/tracks?market=FR&limit=10&offset=${offset}`, {
		headers: {
			Accept: "application/json",
			Authorization: "Bearer BQDdnSY8XrrbYY_DFV-jemgPmyBx4zLOsgNuPFRs7NLXyjT85j8NwSXa1LpkTCSffVTMiO_0dHRvUKrDxCDKgCa75lAuRPyGCSJA8vLbfyG8phq0XF05XBB2J1nmk2LcjRR2KPfZeBXZYuVUmBiwJM3TgY_-eSWXk4F_a5UpDDHXCl4QBbv0yqIgKrSWIYeoUn9VA96ZzU8DEmN16euNuVnDrZgaC6Q3RSjpseu0RGbgzvgnAhvumsT_HtA4FzI826VC8DpcMO1aMxCIS5TcCqZI9VzSnFSvKP17Ki8dgyv3",
			"Content-Type": "application/json"
		}
	})
    .then((data) => data.json())
    .then((json) => setTracks(json));
  }

  useEffect(() => {
    _get_tracks();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>
            test
          </Text>
          {
              <FlatList
			  	style={{display: "flex", flexDirection:'row'}}
                data={tracks?.items}
			  	scrollEnabled={true}
				horizontal={true}
				onEndReachedThreshold={10}
				// onEndReached={_get_tracks(tracks?.items?.length)}
                renderItem={({item, key}) => (
					<View style={{width: 150, padding: 5, backgroundColor: 'red', margin: 5}}>
						<Text style={{maxWidth: 150}}>{item.track.name}</Text>
						<Image source={{uri: item.track.album.images[0].url}}
						style={{width: "auto", height: 150, margin: "auto"}} />
					</View>
				)}
              />
          }
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
