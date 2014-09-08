/**
 * HomeController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    index: function(req, res) {
        res.view('homepage',{
            user: req.user || {}
        });
    }
};