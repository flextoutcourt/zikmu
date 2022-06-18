import axios from 'axios';

class LikedSongHandler {

	constructor(){
		this.likedSongConfig = {}
	}

	async get_liked_songs(authenticationToken){
		const promise = axios.get('https://api.spotify.com/v1/me/tracks', {
			headers: {
				'Authorization': 'Bearer ' + authenticationToken
			}
		});
		return promise.then(data => data.data);
	}

}

const likedSongHandler = new LikedSongHandler();
export default likedSongHandler;
