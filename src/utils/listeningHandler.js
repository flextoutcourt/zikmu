import axios from 'axios';

class ListeningHandler {
    constructor() {
        this.listeningConfig = {};
    }

    async get_listening_state(authenticationToken){
        const promise = axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + authenticationToken,
                "Content-Type": "application/json"
            },
        });
        return promise.then(data => data);
    }
}

const listeningHandler = new ListeningHandler();

export default listeningHandler;
