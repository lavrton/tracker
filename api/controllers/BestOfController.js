/**
 * BestOfController
 *
 * @description :: Server-side logic for managing bestofs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    subscribe : function(req, res) {
        BestOf.find(function(err, questions) {
            BestOf.watch(req.socket);
            BestOf.subscribe(req.socket, questions);
        });
    },
    create : function(req, res) {
        var params = req.params.all();
        params.owner = req.user;
        BestOf.create(params, function (err, question) {
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
        BestOf.find({owner : req.user.id}, function(err, questions) {
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
        BestOf.findOne({owner : req.user.id, id : req.params.id}, function(err, question) {
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
        BestOf.findOne({owner : req.user.id, id : req.params.id}, function(err, quest) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!quest) {
                    res.json({
                        error : 'no such bestOf'
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
        BestOf.findOne({owner : req.user.id, id : req.params.id}, function(err, quest) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!quest) {
                    res.json({
                        error : 'no such bestOf'
                    });
                } else {
                    BestOf.destroy({id : req.params.id} ,function(error) {
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

