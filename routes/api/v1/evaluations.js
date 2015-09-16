var api           = require('../../../api_routes.js');
var Evaluation    = require('../../../models/schema/evaluation.js');
var HttpStatus    = require('http-status');
var uuid          = require('node-uuid');
var validate      = require('express-validation');
var EvaluationJoi = require('../../../models/joi/evaluation.js');

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);
  var hasRole    = require('../../../models/hasRole.js')(passport);

  router.get(api.route('evaluations_list'), [isLoggedIn],  function(req, res) {

    if (!req.user.hasRole(['admin']) && !req.user.hasRole(['moderator'])) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }
    if (req.query.scenario_version && !req.query.scenario_uuid) {
      return res.status(HttpStatus.BAD_REQUEST).send('scenario_version query parameter requires scenario_uuid');
    }

    var filter = {};
    if (req.query.scenario_uuid) {
      filter['scenario.uuid'] = req.query.scenario_uuid;
    }
    if (req.query.scenario_version) {
      filter['scenario.version'] = req.query.scenario_version;
    }
    if (req.query.user_uuid) {
      filter.user = req.query.user_uuid;
    }
    var query = Evaluation.find(filter);
    if (req.query.skip && !isNaN(req.query.skip)) {
      query = query.skip(parseInt(req.query.skip));
    }
    if (req.query.limit && !isNaN(req.query.limit)) {
      query = query.limit(parseInt(req.query.limit));
    }
    query.exec(function(err, evaluations) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).send(evaluations.map(function(evaluation) {
        return evaluation.toObject();
      }));
    });
  });

  router.get(api.route('evaluation_by_uuid'), [isLoggedIn], function(req, res) {
    if (!req.user.hasRole(['admin']) && !req.user.hasRole(['moderator'])) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }
    Evaluation.findOne({ uuid : req.params.uuid }, function(err, evaluation) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).send(evaluation.toObject());
    });
  });

  var evaluationUpdateFields = ['scenario','submitted','answers','comment'];
  var forbiddenUpdateFields = ['uuid', 'user', 'timestamp'];

  router.post(api.route('evaluations_list'), [isLoggedIn], function(req, res) {

    if (forbiddenUpdateFields.some(function(field) { return req.body[field]; })) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Not allowed to post fields [' + forbiddenUpdateFields.join(', ') + '].');
    }

    if (!req.body.scenario || !req.body.scenario.uuid || !req.body.scenario.version) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing scenario, scenario UUID and/or scenario version in request body');
    }

    var evaluation = new Evaluation(req.body);
    evaluation.uuid = uuid.v4();
    evaluation.user = req.user.uuid;
    evaluation.timestamp = new Date().toISOString();
    evaluation.save(function(err) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      Evaluation.findOne({ uuid : evaluation.uuid }, function(err, retrieved) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        res.location(api.reverse('evaluation_by_uuid', { uuid: retrieved.uuid }));
        return res.status(HttpStatus.OK).send(retrieved.toObject());
      });
    });
  });

  router.patch(api.route('evaluation_by_uuid'), [isLoggedIn, validate(EvaluationJoi)], function(req, res) {
    Evaluation.findOne({ uuid : req.params.uuid }).exec(function(err, evaluation) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      if (!evaluation) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }
      if (evaluation.user !== req.user.uuid) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .send('You are not the creator of the evaluation with UUID ' + req.params.uuid);
      }
      if (evaluation.submitted) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .send('Evaluation was already flagged as submitted, can\'t be changed afterwards.');
      }

      evaluationUpdateFields.forEach(function(field) {
        evaluation[field] = req.body[field];
      });
      evaluation.timestamp = new Date().toISOString();

      evaluation.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        return res.status(HttpStatus.OK).send(evaluation.toObject());
      });
    });
  });

  return router;
};