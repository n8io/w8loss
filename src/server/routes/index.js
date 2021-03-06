module.exports = function(app, options) {
  require('./all')(app, options);
  require('./home')(app, options);

  // Catch 400 and 500 errors
  require('./catch')(app, options);
};