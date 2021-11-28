var SpotifyWebApi = require('spotify-web-api-node');

const spotifyConfig = {
    clientId: "f57a06423bf043b6bd5ecebe2b0e9c5a",
    clientSecret: "659b8653e6b744e2a99f9363dac84688",
    redirectUrl: "info.enguehard.localhost.quentin://oauthredirect"
};

var spotifyApi = new SpotifyWebApi(spotifyConfig);

async function proxySpotifyToken(_req, res){
    //Retrieve code from request
    const code = _req.body.code;
    const refreshToken = _req.body.refresh_token;

    if(!code && !refreshToken){
        return res.status(403).json({success: false, data: "Not authorized"});
    }

    if(refreshToken){ 
        //Refresh token is available, retrieve a new access token
        spotifyApi.setRefreshToken(refreshToken);
        spotifyApi.refreshAccessToken().then((data) => {
            data.body.refreshToken = refreshToken;
            return res.json(data.body);
        }, (error) => {
            console.log('Could not refresh access token', error);
        }).catch(oError => {
            return res.json(oError)
        })
    }

    if(code){
        //Retrieve new refresh token and access token
        spotifyApi.authorizationCodeGrant(code).then((data) => {
            return res.json(data.body);
        }).catch(e => {
            console.log('Something went wrong', e);
        })
    }


}

module.exports = {
    proxySpotifyToken
};