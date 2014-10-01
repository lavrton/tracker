/**
* Purpose.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    key : {
        type : 'string',
        required : true
    },
    items : {
        type : 'array',
        defaultsTo : []
    },
      owner: {
          model: 'user',
          required : true
      }
  }
};

