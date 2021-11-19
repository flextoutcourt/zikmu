import {authorize, refresh} from 'react-native-app-auth';

class AuthenticationHandler {
  constructor() {
    this.spotifyAuthConfig = {
      clientId: 'f57a06423bf043b6bd5ecebe2b0e9c5a',
      clientSecret: '659b8653e6b744e2a99f9363dac84688',
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
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
      },
    };
  }

  async onLogin() {
    try {
      const result = await authorize(this.spotifyAuthConfig);
      alert(JSON.stringify(result));
      return result;
    } catch (error) {
        alert(error)
      console.log(JSON.stringify(error));
    } 
  }

  async refreshLogin(refreshToken) {
    const result = await refresh(this.spotifyAuthConfig, {
      refreshToken: refreshToken,
    });
    console.log(JSON.stringify(result));
    return result;
  }

}

const authHandler = new AuthenticationHandler();

export default authHandler;