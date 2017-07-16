/**
 * Get an item from an array collection by id
 */
const getByIdFromArray = module.exports.getByIdFromArray = function getByIdFromArray(collection = []) {
  return function(id = '') {
    return collection.find((item = {}) => item.id === id);
  }
}

/**
 * Get an item from an object collection by id
 */
const getByIdFromHash = module.exports.getByIdFromHash = function getByIdFromHash(collection = {}) {
  return function(id = '') {
    return collection[id];
  }
}

/**
 * Get an item from a collection by id
 */
const getByIdFromCollection = module.exports.getByIdFromCollection = function getByIdFromCollection(collection = []) {
  return (
    Array.isArray(collection) ?
    getByIdFromArray(collection) :
    getByIdFromHash(collection)
  );
}
