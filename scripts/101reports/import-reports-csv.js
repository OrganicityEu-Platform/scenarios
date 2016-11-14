// Find uuid of logged in user:
// In a browser, type:
// view-source:http://localhost:8080/organicity-scenario-tool/api/v1/auth/currentUser
//
// Import reports:
// Copy image files (entire "101reports" subfolder) to tmp: "gulp 101reports"
// In a shell, type:
// cd organicity/node-scenario-tool/scripts/101reports
// node import-reports-csv.js <uuid> reports.csv

var fs              = require('fs');
var parse           = require('csv-parse');

var mongoose        = require('mongoose');
var configDB        = require('../../config/database.js');

var Report          = require('../../models/schema/report.js');
var ReportConfig    = require('../../config/report.js');

var ellipsis        = require('../../util/ellipsis.js');
var uuid            = require('node-uuid');

if (!process.argv[2]) {
  console.error('Two parameters needed: uuid csv');
  process.exit();
}

var creator_uuid = process.argv[2];

if (!process.argv[3]) {
  console.error('Two parameters needed: uuid csv');
  process.exit();
}

var file = process.argv[3];

mongoose.connect(configDB.url);

var cleanTags = function(tags) {
  if (!tags) {
    return null;
  }
  if (65533 === tags.codePointAt(0)) {
    // filter out this value
    return null;
  }

  return tags.split(',').map(function(s) {
    var focusOn = /focus on.*\:\s*/i;
    s = s.replace(focusOn, '');
    return s.trim();
  });
};

var parser = parse({delimiter: ';'}, function(err, data) {

  if (err) {
    console.error('ERROR', err);
    return;
  }

  // The first line
  for (var i = 1 ; i < data.length; i++) {

    // print progress
    if (i > 1) {
      process.stdout.clearLine();  // clear current text
      process.stdout.cursorTo(0);  // move cursor to beginning of line
    }
    process.stdout.write('Import report ' + i + ' of ' + (data.length - 1));

    // build object
    var s = {};
    s.version = 1;
    s.uuid = uuid.v4();
    s.title = data[i][1];
    s.creator = creator_uuid;
    s.credit = data[i][2];
    s.organizations = cleanTags(data[i][2]);
    s.orgtypes = cleanTags(data[i][3]);
    s.types = cleanTags(data[i][4]);
    s.year = data[i][5];
    s.areas = cleanTags(data[i][6]);
    s.domains = cleanTags(data[i][7]);
    s.approaches = data[i][8];
    s.tags = cleanTags(data[i][9]);
    s.abstract = ellipsis(data[i][10], ReportConfig.max.abstract - 5);
    s.url = data[i][11];

    // Import thumbnail
    s.thumbnail = 'tmp/101reports/600px/' + i + '_600px.jpg';

    // Import cover
    s.image = 'tmp/101reports/covers/' + i + '.cover.jpg';

    var report = new Report(s);
    report.save(function(err) {
      if (err) {
        console.error('ERROR', err);
      } else {
        // console.log('Import done!');
      }
    });
  }
  console.log('.');
  console.log('Hit Ctrl+C');
});

fs.createReadStream(file).pipe(parser);
