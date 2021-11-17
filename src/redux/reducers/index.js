import { AsyncStorage } from 'react-native';

import {combineReducers} from 'redux';

import authenticationSlice from '../features/authentication/authenticationSlice';
import {persistReducer} from 'redux-persist';

const authenticationConfig = {
  key: 'authentication',
  storage: AsyncStorage,
  blacklist: ['accessToken'],
};

const rootReducer = combineReducers({
  authentication: persistReducer(authenticationConfig, authenticationSlice),
});

export default rootReducer;