import {createSlice} from '@reduxjs/toolkit';

const likedSlice = createSlice({
	name: 'liked',
	initialState: {
		liked: [],
	},
	reducers: {
		setLiked: (state, action) => {
			if(state.liked.total !== action.payload.total){
				state.liked = action.payload;
			}
		},
		refreshLiked(state, action) {
			if(state.liked.total !== action.payload.total) {
				//compare date and update if needed
				if (state.liked.items[0].added_at < action.payload.items[0].added_at) {
					state.liked = action.payload;
				}
			}
		},
	},
});

/*
* add liked track to state with a new parameter called weight
* to determine the order of the tracks in the liked list
* in order to check if the tracks positions have changed
* AND
* if new tracks have been added to the liked list
*
* */


export const {
	setLiked, refreshLiked,
} = likedSlice.actions;

export default likedSlice.reducer;
