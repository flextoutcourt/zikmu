import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import RecentComponent from '../../components/Home/Recents/RecentComponent';
import GenreComponent from '../../components/Home/Genres/GenreComponent';
import ReleaseComponent from '../../components/Home/Release/ReleaseComponent';
import FollowComponent from '../../components/Home/Follows/FollowComponent';
import {SharedElement} from 'react-navigation-shared-element';

const HomeScreen = (props) => {
  const navigation = useNavigation();
  const [opacity, setOpacity] = React.useState(1);
  useFocusEffect(() => {
    if (navigation.isFocused()) {
      setOpacity(1);
    }
  });

  const _display_message = () => {
    let now = parseInt(new Date().getHours());
    let message = null;
    switch (true) {
      case (now < 2):
        message = 'Faut dormir';
        break;
      case (now < 8):
        message = 'Bien matinal';
        break;
      case (now < 10):
        message = 'Bien dormi ?';
        break;
      case (now < 12):
        message = 'Bonjour';
        break;
      case (now < 14 || (now >= 19 && now < 21)):
        message = 'Bon appétit';
        break;
      case (now < 18):
        message = 'Bonjour';
        break;
      case (now < 24):
        message = 'Bonsoir';
        break;
    }
    return message;
  };

  const stories = [
    {
      id: 1,
      user: {
        name: 'Vald',
        picture: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg',
      video: 'https://www.youtube.com/embed/xPbRsca_l7c',
    },
    {
      id: 2,

      user: {
        name: 'Sch',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/1.jpg',
    },
    {
      id: 3,

      user: {
        name: 'Capri',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/2.jpg',
    },
    {
      id: 4,

      user: {
        name: 'Bu$hi',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/3.jpg',
    },
    {
      id: 5,

      user: {
        name: 'Fianso',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/5.jpg',
    },
    {
      id: 6,

      user: {
        name: 'ZKR',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/6.jpg',
    },
    {
      id: 7,

      user: {
        name: 'Vald',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/7.jpg',
      video: 'https://www.youtube.com/embed/xPbRsca_l7c',
    },
    {
      id: 11,

      user: {
        name: 'Damso',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/4.jpg',
    },
    {
      id: 12,

      user: {
        name: 'Seezy',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/1.jpg',
    },
    {
      id: 13,

      user: {
        name: 'Kalash Criminel',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/2.jpg',
    },
    {
      id: 14,

      user: {
        name: 'Freeze Corleone',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/3.jpg',
    },
    {
      id: 15,

      user: {
        name: 'Kaaris',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/5.jpg',
    },
    {
      id: 16,

      user: {
        name: 'Ninho',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/6.jpg',
    },
    {
      id: 17,

      user: {
        name: 'Rim\'k',
        source: 'https://picsum.photos/48',
      },
      source: 'https://raw.githubusercontent.com/wcandillon/can-it-be-done-in-react-native/master/season4/src/Snapchat/assets/stories/7.jpg',
      video: 'https://www.youtube.com/embed/xPbRsca_l7c',
    },
  ];


    return (
        <LinearGradient
            colors={['#15202B', '#15202B']}
            style={{
                marginTop: -StatusBar.currentHeight,
                ...styles.container,
            }}>
            <ScrollView style={{paddingTop: StatusBar.currentHeight, paddingBottom: 10}} stickyHeaderIndices={[0]}
                        stickyHeaderHiddenOnScroll={true}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{
                    flex: 1,
                    backgroundColor: '#15202B',
                    paddingVertical: 10,
                    elevation: 10,
                    width: Dimensions.get('screen').width,
                    paddingTop: StatusBar.currentHeight + 10,
                }}>
                    {stories.map((story, key) => (
                        <Pressable onPress={() => props.navigation.navigate('Story', {story})}
                                   style={{position: 'relative'}}>
                            <SharedElement id={story.id}>
                                <View style={styles.stories.imageContainer}>
                                    <Image source={{uri: story.source}} style={styles.stories.image}/>
                                </View>
                            </SharedElement>
                            <Pressable onPress={() => {
                                //fetch artist_id from database ticket #FLEX-38
                                // navigation.push('Artist', {});
                            }} style={{flex: 1, flexDirection: 'row', justifyContent: 'center', maxWidth: '99%'}}>
                                <Text style={{textAlign: 'center', marginTop: 5, color: 'white'}}
                                      numberOfLines={1}>{story.user.name}</Text>
                            </Pressable>
                        </Pressable>
                    ))}
                </ScrollView>
                <View style={{
                    flex: 1,
                    paddingVertical: 20,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{_display_message()}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => navigation.push('Self')} style={{marginLeft: 20}}>
                            <Icon name={'settings'} solid={true} size={24} color={'white'}/>
                        </TouchableOpacity>
                    </View>
                </View>



                <RecentComponent {...props} isTop={true}/>
                <ReleaseComponent {...props} />
                <GenreComponent {...props} />
                <RecentComponent {...props} isTop={false}/>
                <FollowComponent {...props} />



            </ScrollView>
        </LinearGradient>
    );
};

const mapStateToProps = store => {
  return {
    store: store,
  };
};

const borderRadius = 10;
const margin = 5;
const width = Dimensions.get('screen').width / 4 - margin * 2;

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2732',
  },
  stories: {
    container: {
      width,
      height: width * 1.77,
      marginTop: 16,
      borderRadius,
      backgroundColor: 'red',
    },
    imageContainer: {
      borderRadius: 10,
      width: 64,
      height: 64 * 1.77,
      elevation: 10,
      marginHorizontal: 10,
      borderColor: 'white',
      borderWidth: 2,
    },
    image: {
      ...StyleSheet.absoluteFill,
      width: undefined,
      height: undefined,
      resizeMode: 'cover',
      borderRadius,
    },
  },
});

export default connect(mapStateToProps)(HomeScreen);
