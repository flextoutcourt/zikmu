
//user/route.js
const router = require("express").Router();
const controller = require("./controller");

//Endpoint url: https://yourfirebaseurl.com/api/authentication
router.post("/authentication/", controller.authentication);


module.exports = router;