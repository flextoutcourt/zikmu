const functions = require('firebase-functions');
const server = require('./src/server');

//Create API endpoint for firebase functions using server.js to handle incoming calls
//Endpoint url: https://yourfirebaseurl.com/api/*
//* will be filled with the endpoints defined in server.js
const api = functions
    .region('europe-west1')
    .runWith({memory: '2GB', timeoutSeconds: 120})
    .https.onRequest(server);

module.exports = {
    api,
};
