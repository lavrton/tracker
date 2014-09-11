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
                res.json({
                    error : err
                });
            } else {
                res.json(question);
            }
        });
    },
    index : function(req, res) {
        Question.find({owner : req.user.id}, function(err, questions) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(questions);
            }
        });
    },
    find : function(req, res) {
        Question.findOne({owner : req.user.id, id : req.params.id}, function(err, question) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(question);
            }
        });
    },
    update : function(req, res) {
        Question.findOne({owner : req.user.id, id : req.params.id}, function(err, quest) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!quest) {
                    res.json({
                        error : 'no such question'
                    });
                } else {
                    var params = req.params.all();
                    quest.title = params.title;
                    quest.answers = params.answers
                    quest.save(function(error) {
                        if(error) {
                            res.json({
                                error : error
                            });
                        } else {
                            res.json(quest);
                        }
                    });
                }

            }
        });
    },
    destroy : function(req, res) {
        Question.findOne({owner : req.user.id, id : req.params.id}, function(err, quest) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!quest) {
                    res.json({
                        error : 'no such question'
                    });
                } else {
                    Question.destroy({id : req.params.id} ,function(error) {
                        if(error) {
                            res.json({
                                error : error
                            });
                        } else {
                            res.json(quest);
                        }
                    });
                }
            }
        });
    }
};

