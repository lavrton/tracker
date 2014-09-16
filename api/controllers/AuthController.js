/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

    info : function(req, res) {
        if (req.user)
            res.json({
                name : req.user.name
            });
        else {
            res.json({});
        }

    },
    index: function(req, res) {
        res.view();
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    },
    demoLogin : function(req, res) {
        User.findOne({
            name : 'demo--user'
        }).then(function(user) {
            if (!user) {
                return User.create({
                    name : 'demo--user',
                    uid : 'demo--user'
                });
            } else {
                return user;
            }
        }).then(function(user) {
            req.logIn(user, function(err) {
                if (!err) {
                    res.redirect('/');
                } else {
                    console.error(err);
                }
            });
        }).fail(function(err) {
            console.error(err);
            res.json({
                error : err
            });
        });
    },
    // http://developer.github.com/v3/
    // http://developer.github.com/v3/oauth/#scopes
    github: function(req, res) {
        passport.authenticate('github', { failureRedirect: '/login' }, function(err, user) {
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err);
                    res.view('500');
                    return;
                }

                res.redirect('/');
                return;
            });
        })(req, res);
    },

    // https://developers.facebook.com/docs/
    // https://developers.facebook.com/docs/reference/login/
    facebook: function(req, res) {
        passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }, function(err, user) {
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err);
                    res.view('500');
                    return;
                }

                res.redirect('/');
                return;
            });
        })(req, res);
    },

    // https://developers.google.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
    google: function(req, res) {
        passport.authenticate('google', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }, function(err, user) {
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err);
                    res.view('500');
                    return;
                }
                res.redirect('/');
                return;
            });
        })(req, res);
    },

    // https://apps.twitter.com/
    // https://apps.twitter.com/app/new
    twitter: function(req, res) {
        passport.authenticate('twitter', { failureRedirect: '/login' }, function(err, user) {
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err);
                    res.view('500');
                    return;
                }

                res.redirect('/');
                return;
            });
        })(req, res);
    }
};