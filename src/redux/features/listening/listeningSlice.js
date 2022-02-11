import {createSlice} from '@reduxjs/toolkit';

const listeningSlice = createSlice({
    name: 'listening',
    initialState: {
        listening: null
    },
    reducers: {
        getListening(state, action){
            state.listening = action.payload.listening;
        }
    }
});

export const {
    getListening
} = listeningSlice.actions;

export default listeningSlice.reducer;
