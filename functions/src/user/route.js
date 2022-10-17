//user/route.js
const router = require('express').Router();
const controller = require('./controller');

//Endpoint url: https://yourfirebaseurl.com/api/user/authentication
router.post('/authentication/', controller.proxySpotifyToken);

module.exports = router;
