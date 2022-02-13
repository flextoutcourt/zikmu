import {createSlice} from '@reduxjs/toolkit';

const listeningSlice = createSlice({
    name: 'listening',
    initialState: {
        listening: null
    },
    reducers: {
        setListening(state, action){
            state.listening = action.payload.listening;
        },
        refreshListening(state, action){
            if(
                state.listening.item.id !== action.payload.listening.item.id ||
                state.listening.is_playing !== action.payload.listening.is_playing
            ){
                state.listening = action.payload.listening
            }
        }
    }
});

export const {
    setListening,
    refreshListening,
} = listeningSlice.actions;

export default listeningSlice.reducer;
