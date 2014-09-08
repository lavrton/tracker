/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

    attributes: {
        provider: 'STRING',
        uid: 'STRING',
        name: 'STRING',
        email: 'STRING',
        firstname: 'STRING',
        lastname: 'STRING',
        questions: {
            collection: 'question',
            via: 'owner'
        }
    },
    toJSON : function(attrs) {
        return {
            id : attrs.id
        };
    }
};

