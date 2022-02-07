import {authorize, refresh} from 'react-native-app-auth';

class AuthenticationHandler {
	constructor() {
		this.spotifyAuthConfig = {
			clientId: '8bf1e0110ef845e294f1f7b8a898483a',
			clientSecret: '5bf46323f90249b3ba1417df139b5c4c',
			redirectUrl: 'info.enguehard.localhost.quentin://oauthredirect',
			scopes: [
				'playlist-read-private',
				'playlist-read-collaborative',
				'playlist-modify-public',
				'playlist-modify-private',
				'user-library-read',
				'user-library-modify',
				'user-read-email',
				'user-read-private',
				'user-read-recently-played',
				'user-read-currently-playing',
				'user-read-playback-position',
				'user-follow-read',
				'user-top-read',
				'user-follow-modify',
				'user-read-playback-state',
				'user-modify-playback-state',
			],
			serviceConfiguration: {
				authorizationEndpoint: 'https://accounts.spotify.com/authorize',
				tokenEndpoint: 'https://accounts.spotify.com/api/token',
			},
		};
	}

	async onLogin() {
		try {
            return await authorize(this.spotifyAuthConfig);
		} catch (error) {
			alert(error);
			console.log(JSON.stringify(error));
		}
	}

	async refreshLogin(refreshToken) {
        return await refresh(this.spotifyAuthConfig, {
            refreshToken: refreshToken,
        });
	}
}

const authHandler = new AuthenticationHandler();

export default authHandler;
