/**
 * BestOfController
 *
 * @description :: Server-side logic for managing bestofs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    subscribe : function(req) {
        BestOf.find(function(err, bestOf) {
            BestOf.watch(req.socket);
            BestOf.subscribe(req.socket, bestOf);
        });
    },
    create : function(req, res) {
        var params = req.params.all();
        params.owner = req.user;
        BestOf.create(params, function (err, bestOfItem) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(bestOfItem);
            }
        });
    },
    index : function(req, res) {
        BestOf.find({owner : req.user.id}, function(err, bestOf) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(bestOf);
            }
        });
    },
    find : function(req, res) {
        BestOf.findOne({owner : req.user.id, id : req.params.id}, function(err, bestOf) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(bestOf);
            }
        });
    },
    update : function(req, res) {
        BestOf.findOne({owner : req.user.id, id : req.params.id}, function(err, bestOfItem) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!bestOfItem) {
                    res.json({
                        error : 'no such bestOf'
                    });
                } else {
                    var params = req.params.all();
                    bestOfItem.value = params.value;
                    bestOfItem.score = params.score;
                    bestOfItem.save(function(error) {
                        if(error) {
                            res.json({
                                error : error
                            });
                        } else {
                            res.json(bestOfItem);
                        }
                    });
                }

            }
        });
    },
    destroy : function(req, res) {
        BestOf.findOne({owner : req.user.id, id : req.params.id}, function(err, bestOfItem) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!bestOfItem) {
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
                            res.json(bestOfItem);
                        }
                    });
                }
            }
        });
    }
};

