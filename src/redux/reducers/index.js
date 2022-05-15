import {combineReducers} from 'redux';

import authenticationSlice from '../features/authentication/authenticationSlice';
import listeningSlice from '../features/listening/listeningSlice';
import likedSlice from '../features/liked/likedSlice';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authenticationConfig = {
    key: 'authentication',
    storage: AsyncStorage,
    blacklist: ['accessToken'],
};

const listeningConfig = {
    key: 'listening',
    storage: AsyncStorage,
};

const likedConfig = {
    key: 'liked',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    authentication: persistReducer(authenticationConfig, authenticationSlice),
    listening: persistReducer(listeningConfig, listeningSlice),
    liked: persistReducer(likedConfig, likedSlice),
});

export default rootReducer;
