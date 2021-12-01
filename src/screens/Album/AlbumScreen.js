import axios from 'axios';
import React from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, View, SectionList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';


class AlbumScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            album: null,
            disks: null,
            test: null
        }
    }
    
    _get_album = () => {
        const promise = axios.get(`https://api.spotify.com/v1/albums/${this.props.route.params.album_id}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.store.authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
        const response = promise.then((data) => data.data);
        return response;
    }

    _group_by_key = (array) => {
        let groups = [];
        array.map((item, key) => {
            if(groups[item.disc_number]){
                groups[item.disc_number].data.push(item);
            }else{
                groups[item.disc_number] = {
                    title: 'Disque ' + item.disc_number,
                    data: [],
                };
                groups[item.disc_number].data.push(item);
            }
        })
        return groups;

    }
    
    componentDidMount(){
        this._get_album().then(json => {
            this.setState({album: json});
            this.setState({disks :this._group_by_key(json.tracks.items, 'disc_number')});
            this.setState({test :this._group_by_key(json.tracks.items, 'disc_number')});
            this.props.navigation.setOptions({
                headerTitle: () => (
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -15, overflow: 'hidden'}}>
                        {json?.images[0]
                            ?
                                <Image source={{uri: json?.images[0]?.url}} style={{height: 48, width: 48, borderRadius: 10}} />
                            :
                                null
                        }
                        <Text style={{color: 'black', marginLeft: 10, fontWeight: 'bold'}}>{json?.name}</Text>
                    </View>
                ),
                headerRight: () => (
                    <View style={{backgroundColor: "white"}}>
                        <FontAwesome5Icon name='heart' size={24} color={"red"} />
                    </View>
                )
            })
        });
    }

    render(){
        return (
            <LinearGradient colors={['#B00D72', '#5523BF']} style={{marginTop: -StatusBar.currentHeight}, styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={{alignItems: 'center', elevation: 10, marginTop: 10}}>
                        <Image source={{uri: this.state.album?.images[0]?.url}} style={{width: Dimensions.get('screen').width - 20, height: Dimensions.get('screen').width - 20, marginBottom: 15, borderRadius: 10}}/>
                    </View>
                    <Text style={{fontSize: 24, color: 'white', textAlign: 'center'}}>{this.state.album?.name}</Text>
                    {
                        this.state.disks && this.state.test
                        ?
                            <SectionList
                                sections={this.state.disks.splice(1)}
                                keyExtractor={({item, index}) => item * index}  
                                renderItem={({item, section}) => (
                                    <TrackItem track={item} album={this.state.album} disks={this.state.test} type={"album"} />
                                )}
                                renderSectionHeader={({ section: { title } }) => (
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', marginLeft: 5}}> 
                                        <FontAwesome5Icon name='compact-disc' size={24}/>
                                        <Text style={{fontSize: 18, marginLeft: 10, color: 'white', marginVertical: 15}}>{title}</Text>
                                    </View>
                                )}
                            />
                        :
                            null
                    }
                </ScrollView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

const mapStateToProps = store => {
    return{
        store: store
    }
}

export default connect(mapStateToProps)(AlbumScreen)
