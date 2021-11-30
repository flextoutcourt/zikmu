import React from 'react';
import {View,
        Text,
        TouchableOpacity, StyleSheet} from 'react-native';

TouchableOpacity.defaultProps = {activeOpacity: 0.5}
        
function Button({onPress, title, color}) {
    return(
        <TouchableOpacity onPress={onPress} style={{backgroundColor: color, ...styles.button}} >
            <Text>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
    }
});

export default Button;