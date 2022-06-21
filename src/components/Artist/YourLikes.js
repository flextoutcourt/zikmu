import React from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {connect} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class YourLikes extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            likes: [
                1, 1, 1, 1, 1, 1, 1,
            ],
        };
    }

    render() {
        return (
            <View style={{
                flex: 1,
                width: Dimensions.get('screen').width,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <View style={{width: 48, height: 48, position: 'relative'}}>
                    <Image source={{uri: this.props.artist?.images[0]?.url}}
                           style={{height: '100%', width: '100%', borderRadius: 100, elevation: 5}}/>
                    <View style={{
                        position: 'absolute',
                        right: '-50%',
                        bottom: '-50%',
                        height: 18,
                        width: 18,
                        backgroundColor: 'red',
                        transform: [{translateX: -26}, {translateY: -20}],
                        borderRadius: 100,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 10,
                    }}>
                        <FontAwesome name="heart" size={10} color="white"/>
                    </View>
                </View>
                <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Titres likés</Text>
                    <Text>{this.state.likes?.length} titres de {this.props.artist?.name}</Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = store => {
    return {
        store: store,
    };
};

export default connect(mapStateToProps)(YourLikes);
