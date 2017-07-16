/**
 * Import the different populate functions
 */
const populateByConvention = require('./populate-by-convention');
const populateByReference = require('./populate-by-reference');

/**
 * Export the interfaces
 */
module.exports = {
  populateByReference,
  populateByConvention,
};
