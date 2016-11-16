// Fixes trailing spaces in the sectors

var mongoose        = require('mongoose');
var configDB        = require('../../config/database.js');

mongoose.connect(configDB.url);

var Scenario     = require('../../models/schema/scenario.js');

Scenario.find({}, function(err, scenarios) {
  for (var i = 0; i < scenarios.length; i++) {
    var scenario = scenarios[i];

    if (scenario.sectors) {
      console.log('------------------------------------');
      console.log('Before:', scenario.sectors);
      for (var j = 0; j < scenario.sectors.length; j++) {
        scenario.sectors[j] = scenario.sectors[j].trim().toLowerCase();
      }
      console.log('After:', scenario.sectors);

      Scenario.update({
        uuid : scenario.uuid,
        version : scenario.version
      }, {
        sectors : scenario.sectors
      }, function(err, numAffected) {
        //console.log('numAffected', numAffected.ok);
        //console.log('ok');
      });
    }

  }
});
