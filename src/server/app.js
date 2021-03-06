var express = require('express');

var app = express();

// Establish global variables
require('./init/globals');

// Load up config
require('./helpers/configuration')();

// Initialize logger
global.logger = require('./init/logging').getLogger();

// Check for configuration validation errors, if present don't start the app
if(config.get('configValidationErrors') && config.get('configValidationErrors').length > 0){
  logger.error({configValidationError: config.get('configValidationErrors')});
  logger.fatal('Application is not properly configured. See logs for details.');
  process.exit(1);
}

// CDN helper for Jade templates
app.locals.CDN = require('./helpers/cdn');

// Set high level middleware
require('./init/middleware')(app);

// Define custom routes
require('./routes')(app);

var server = app.listen(app.get('port'), app.get('host'), function (){
  logger.info(
    '%s@%s is running at http://%s:%s',
    app.get('name'),
    app.get('version'),
    app.get('host'),
    app.get('port')
  );
});