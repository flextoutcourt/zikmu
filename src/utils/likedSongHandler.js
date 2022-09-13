import axios from 'axios';

class LikedSongHandler {

	constructor(){
		this.likedSongConfig = {}
	}

	async get_liked_songs(authenticationToken, next = null, prev = null){
		let url = 'https://api.spotify.com/v1/me/tracks?limit=50&offset=0';
		if(next){
			url = next;
		}
		const promise = axios.get(url, {
			headers: {
				'Authorization': 'Bearer ' + authenticationToken
			}
		});
		// promise.then(data => console.log(data.data.total));
		return promise.then(data => data.data);
	}

}

const likedSongHandler = new LikedSongHandler();
export default likedSongHandler;
