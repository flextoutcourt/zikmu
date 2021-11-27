import {authorize, refresh} from 'react-native-app-auth';

class AuthenticationHandler {
  constructor() {
    this.spotifyAuthConfig = {
      clientId: 'f57a06423bf043b6bd5ecebe2b0e9c5a',
      redirectUrl: 'info.enguehard.localhost.quentin://oauthredirect',
      scopes: [
        'user-library-read',
        'user-library-modify',
        'user-top-read',
        'playlist-read-private',
        'user-read-recently-played',
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state'
      ],
      serviceConfiguration: {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://europe-west1-zikmu-e3f16.cloudfunctions.net/api/user/authentication',
      },
    };
  }

  async onLogin() {
    try {
      const result = await authorize(this.spotifyAuthConfig);
      return result;
    } catch (error) {
      alert(error)
    } 
  }

  async refreshLogin(refreshToken) {
    const result = await refresh(this.spotifyAuthConfig, {
      refreshToken: refreshToken,
    });
    return result;
  }

}

const authHandler = new AuthenticationHandler();

export default authHandler;