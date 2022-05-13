import React from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {connect} from 'react-redux';

class GenreItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.push('Genre', {
                genre_id: this.props.genre.item.id,
            })} style={{marginHorizontal: 10, marginVertical: 10}}>
                <Image source={{uri: this.props.genre.item.icons[0].url}} style={styles.image}/>
                <Text style={{textAlign: 'center', color: 'white'}}>{this.props.genre?.item?.name}</Text>
            </TouchableOpacity>
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
        elevation: 10,
    },
});

const mapStateToProps = store => {
    return {
        store: store,
    };
};

export default connect(mapStateToProps)(GenreItem);
