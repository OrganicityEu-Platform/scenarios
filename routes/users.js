module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();
    var isLoggedIn = require('../config/isLoggedIn.js')(passport);
    var hasRole = require('../config/hasRole.js');

   //###############################################################
    // is valid schemas
    //###############################################################

    var validate = require('isvalid').validate;

    var UserSchemaPost = {
        type : Object,
        unknownKeys: 'remove',
        schema : {
            'roles': {
                type: Array,
                required: true,
                schema: {
                    type: String
                }
            }
        }
    }

    //###############################################################
    // Routes
    //###############################################################

    var User = require('../models/user.js');
    var Scenario = require('../models/Scenario.js');

    router.get('/', [isLoggedIn, hasRole(["admin"])], function(req, res) {

        User.find(function (err, users) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('users/users.ejs', {
                            user : req.user,
                            users : users
                        });
                    },
                    'application/json': function() {
                        res.json(users);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    router.get('/:id', [isLoggedIn], function(req, res) {

        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {

            if(user == null) {
                res.status(404);
            }

            if (err) {
                console.log(err);
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('users/users.ejs', {
                            user : req.user,
                            users : [user]
                        });
                    },
                    'application/json': function() {
                        res.json(user);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    // GET /users/:id
    router.get('/:id/edit', [isLoggedIn, hasRole(["admin"])], function(req, res) {

        res.format({
            'text/html': function() {
                res.render('users/users-form.ejs', {
                    user : req.user,
                    id : req.params.id
                });
            },
            'default': function() {
                res.send(406, 'Not Acceptable');
            }
        });
    });


    // GET /scenarios
    router.get('/:id/scenarios', function(req, res) {

        Scenario.find({ 'owner' : req.params.id }, function (err, scenarios) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios.ejs', {
                            user : req.user,
                            scenarios : scenarios
                        });
                    },
                    'application/json': function() {
                        res.json(scenarios);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    // PUT /users/:id
    router.put('/:id', [isLoggedIn, hasRole(["admin"]), validate.body(UserSchemaPost)], function(req, res, next) {

        User.findOneAndUpdate({ 'uuid' :  req.params.id }, req.body, function (err, user) {
            if(user == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.json(user);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });


    // DELETE /users/:id
    router.delete('/:id', [isLoggedIn, hasRole(["admin"])], function(req, res, next) {

        User.findOneAndRemove({ 'uuid' :  req.params.id }, req.body, function (err, user) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.json(user);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });


    return router;
};

