const spotifyConfig = {
    clientId: 'f57a06423bf043b6bd5ecebe2b0e9c5a',
    clientSecret: '659b8653e6b744e2a99f9363dac84688',
    redirectUrl: "info.enguehard.localhost.quentin://oauthredirect"
};

async function proxySpotifyToken(_req, res){
    //Retrieve code from request
    const code = _req.body.code;
    const refreshToken = _req.body.refresh_token;

    if(!code && !refreshToken){
        return res.status(403).json({success: false, data: "Not authorized"});
    }

    if(refreshToken){ 
        //Refresh token is available, retrieve a new access token
        return res.json({ todo: "Refresh accesstoken"});
    }

    if(code){
        //Retrieve new refresh token and access token
        return res.json({ todo: "Get refresh token & access token"});
    }


}

module.exports = {
    proxySpotifyToken
};