import {createSlice} from '@reduxjs/toolkit';

const likedSlice = createSlice({
	name: 'liked',
	initialState: {
		liked: [],
	},
	reducers: {
		setLiked: (state, action) => {
			state.liked = action.payload;
		},
		refreshLiked(state, action){
			if (action.payload.length > 0) {
				state.liked = action.payload;
			}
		}
	}
})

export const {
	setLiked, refreshLiked
} = likedSlice.actions;

export default likedSlice.reducer;
