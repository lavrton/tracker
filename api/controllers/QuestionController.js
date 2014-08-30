/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	subscribe : function(req, res) {
        Question.find(function(err, questions) {
            Question.subscribe(req.socket);
            Question.subscribe(req.socket, questions);
        });
    }
};

