// config/database.js
module.exports = {
  'url'      : process.env.MONGODB_URL      || 'mongodb://localhost/scenarios',     // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
  'test_url' : process.env.MONGODB_TEST_URL || 'mongodb://localhost/scenarios-test' // used for integration / unit testing
};
