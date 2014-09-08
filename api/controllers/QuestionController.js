/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	subscribe : function(req, res) {
        Question.find(function(err, questions) {
            Question.watch(req.socket);
            Question.subscribe(req.socket, questions);
        });
    },
    create : function(req, res) {
        var params = req.params.all();
        params.owner = req.user;
        Question.create(params, function (err, question) {
            if (err) {
                console.log(1, err);
                res.json({
                    error : err
                });
                res.view('500', err);
            } else {
                res.json(question);
            }
        });
    },
    index : function(req, res) {
        Question.find(function(questions){
            console.log(questions);
        });
        Question.find({owner : req.user.id}, function(err, questions) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(questions);
            }
        });
    }
};

