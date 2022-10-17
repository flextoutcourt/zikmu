import {createSlice} from '@reduxjs/toolkit';

const playSlice = createSlice({
  name: 'play',
  initialState: {
    play: false,
  },
  reducers: {
    setPlay(state, action) {
      state.play = action.payload.play;
    },
  },
});

export const {setPlay} = playSlice.actions;

export default playSlice.reducer;
