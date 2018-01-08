if (!process.enc) {
  process.enc = {};
}

module.exports = {
  host :        process.env.WEB_HOST         || 'http://localhost',
  host_external : 'https://scenarios.organicity.eu',
  port :    int(process.env.WEB_PORT)        || 11111,
  port_external : 443,
  contextPath : process.env.WEB_CONTEXTPATH  || '/',
  dev :    bool(process.env.WEB_DEV)         || false,
  title :       process.env.WEB_TITLE        || 'OrganiCity Scenarios'
};

function bool(str) {
  if (str === void 0) {return false;}
  return str.toLowerCase() === 'true';
}

function int(str) {
  if (!str) {return 0;}
  return parseInt(str, 10);
}

function float(str) {
  if (!str) {return 0;}
  return parseFloat(str, 10);
}