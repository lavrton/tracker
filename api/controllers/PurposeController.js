/**
 * PurposeController
 *
 * @description :: Server-side logic for managing bestofs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    subscribe : function(req) {
        Purpose.find({owner : req.user.id}, function(err, purpose) {
            Purpose.watch(req.socket);
            Purpose.subscribe(req.socket, purpose);
        });
    },
    create : function(req, res) {
        var params = req.params.all();
        params.owner = req.user;
        Purpose.create(params, function (err, purpose) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                Purpose.publishCreate(purpose, req);
                res.json(purpose);
            }
        });
    },
    index : function(req, res) {
        Purpose.find({owner : req.user.id}, function(err, purpose) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(purpose);
            }
        });
    },
    find : function(req, res) {
        Purpose.findOne({owner : req.user.id, id : req.params.id}, function(err, purpose) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                res.json(purpose);
            }
        });
    },
    update : function(req, res) {
        Purpose.findOne({owner : req.user.id, id : req.params.id}, function(err, purpose) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!purpose) {
                    res.json({
                        error : 'no such purpose'
                    });
                } else {
                    var params = req.params.all();
                    purpose.items = params.items;
                    purpose.save(function(error) {
                        if(error) {
                            res.json({
                                error : error
                            });
                        } else {
                            Purpose.publishUpdate(purpose.id, purpose, req);
                            res.json(purpose);
                        }
                    });
                }

            }
        });
    },
    destroy : function(req, res) {
        Purpose.findOne({owner : req.user.id, id : req.params.id}, function(err, purpose) {
            if (err) {
                res.json({
                    error : err
                });
            } else {
                if (!purpose) {
                    res.json({
                        error : 'no such purpose'
                    });
                } else {
                    Purpose.destroy({id : req.params.id} ,function(error) {
                        if(error) {
                            res.json({
                                error : error
                            });
                        } else {
                            Purpose.publishDestroy(purpose.id, req);
                            res.json(purpose);
                        }
                    });
                }
            }
        });
    }
};

