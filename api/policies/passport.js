var http = require('http');
var methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];
var passport = require('passport');

module.exports = function (req, res, next) {
    // Initialize Passport
    passport.initialize()(req, res, function () {
        // Use the built-in sessions
        passport.session()(req, res, function () {
            // Make the user available throughout the frontend
            res.locals.user = req.user;
            // Make the request's passport methods available for socket
            if (req.isSocket) {
                for (var i = 0; i < methods.length; i++) {
                    req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
                }
            }
            next();
        });
    });
};